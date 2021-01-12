import { spawn } from "child_process";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const Session = class {
  constructor() {
    this.process = spawn('coqtop');
    this.state = 'init';
    this.cache = '';
    this.cacheErr = '';
    this.statement = '';
    this.goal = {};
    this.pallete = [];
    this.process.stdout.on('data', (data) => {
      console.log(`data: ${data}`);
      this.cache += data;
      console.log(`cache lenght: ${this.cache.length}`);
    });
    this.process.stderr.on('data', (data) => {
      this.cacheErr += data;
    })
  }

  writeStdin(x) {
    this.process.stdin.write(x + '\n');
  }

  async getStdoutValue(x = 200) {
    await delay(x);
    const v = this.cache;
    this.cache = '';
    console.log(`cache sended: ${v}`);
    return v;
  }

  async getStderrValue() {
    await delay(200);
    const v = this.cacheErr;
    this.cacheErr = '';
    return v;
  }

  async cleanCache(x = 10) {
    await delay(x);
    console.log('cleared');
    this.cache = '';
    this.cacheErr = '';
  }

  async getGoal() {
    const so = (await this.getStdoutValue()).trim();
    if (so === '') {
      const err = await this.getStderrValue();
      throw new Error(err);
    }
    console.log(so);
    const y = so.split('\n');
    const hyps = [];
    const goals = [''];
    let mode = 'hyp';
    for (const x of y) {
      const xt = x.trim();
      if (xt.startsWith('No more subgoal')) {
        this.goal = { goals: [], hyps: [], finished: true };
        return;
      }
      if (xt.endsWith('subgoal') || xt.endsWith('subgoals')) continue;
      if (xt == '') continue;
      if (xt.endsWith('======')) {
        mode = 'goal';
        continue;
      }
      if (mode === 'hyp') {
        if (x[2] !== ' ') {
          const sx = xt.split(' : ');
          hyps.push({
            name: sx[0].split(', '),
            type: sx.slice(1).join(' : '),
          });
        } else {
          hyps[hyps.length-1].type += ` ${xt}`;
        }
      } else {
        if (xt.endsWith(' is:')){
          goals.push('');
          continue;
        }
        goals[goals.length - 1] += xt;
      }
    }
    this.goal = { hyps, goals };
    return this.goal;
  }

  async sendTactic(tac) {
    console.log(`tactic = ${tac}`);
    await this.cleanCache();
    this.writeStdin(`${tac}.`);
    try {
      await this.getGoal();
      return { ok: true, goal: this.goal };
    } catch (e) {
      return {
        ok: false,
        reason: e.message,
      };
    }
  };

  async setGoal({ pallete = {}, goal, context, statement, tools = {} }) {
    await this.cleanCache();
    await this.writeStdin(context);
    await this.cleanCache(5000);
    await this.writeStdin(`Goal (${goal}).`);
    await this.getGoal();
    await this.sendTactic('normalize');
    this.statement = statement;
    this.pallete = [];
    this.tools = (() => {
      const {
        auto = 'enable', rewrite = 'enable', assert = 'enable',
        replace = 'enable', custom = 'disable', revert = 'enable',
        remember = 'enable',
      } = tools;
      return { auto, rewrite, assert, replace, custom, revert, remember };
    })();
    for (const p of Object.keys(pallete)) {
      this.pallete.push({
        name: p,
        label: pallete[p],
        type: await this.check(p),
      });
    }
    return this.goal;
  }

  async check(x) {
    await this.cleanCache();
    this.writeStdin(`Check (${x}).`);
    const y = await this.getStdoutValue();
    const z = y.split('\n');
    return z.slice(1).join('\n').trim().slice(2);
  }

  async search(x) {
    await this.cleanCache();
    this.writeStdin(`Search (${x}).`);
    const y = await this.getStdoutValue();
    return y.replace(/\n  /g, ' ').split('\n').filter((a) => a !== '').map((a) => {
      const b = a.split(': ');
      return {
        name: b[0],
        type: b.slice(1).join(': '),
      };
    });
  }

};
