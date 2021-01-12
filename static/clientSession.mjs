import { dragOnClick } from "./dragndrop.mjs";

const ftc = async (body) => {
  const waitingLabel = document.getElementById('wait-label');
  waitingLabel.innerText = 'در انتظار سرور ...';
  const res = await fetch("/api", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  waitingLabel.innerText = '';
  const r = await res.json();
  if (!r.ok) {
    if (r.type === 'server fault') {
      alert(`سرور پکید. این رو گزارش کنید. صفحه رو ریلود کنید.
      این رو هم کپی کنید:
      ${r.error}
      `);
    }
  }
  return r;
};

export const Session = class {
  constructor() {
    this.state = '';
    this.token = '';
    this.goal = {};
    this.pallete = [];
    this.problem = 0;
    this.course = 'basic';
    this.ending = '; normalize';
    this.dom = {
      state: document.getElementById('state'),
      pallete: document.getElementById('pallete'),
      statement: document.getElementById('statement'),
    };
  }

  refreshGoal() {
    if (this.goal.finished) {
      alert('جناب مبارکه. اثبات تموم شد. می ریم مرحله بعدی.');
      window.location = `/?c=${this.course}&l=${this.problem + 1}`;
    }
    const d = this.dom.state;
    while (d.childNodes.length) d.removeChild(d.lastChild);
    for (const hyp of this.goal.hyps) {
      const x = document.createElement('p');
      for (const name of hyp.name) {
        const y = document.createElement('button');
        y.innerText = name;
        y.onclick = dragOnClick({ type: 'hyp', name });
        x.appendChild(y);
      }
      const y = document.createElement('span');
      y.innerText = ` : ${hyp.type}`;
      x.appendChild(y);
      d.appendChild(x);
    }
    const splitter = document.createElement('p');
    splitter.innerText = '===============================';
    d.appendChild(splitter);
    const goal = document.createElement('button');
    const gl = this.goal.goals;
    goal.innerText = gl[0];
    goal.onclick = dragOnClick({ type: 'goal' });
    d.appendChild(goal);
    if (gl.length > 1) {
      const p = document.createElement('p');
      p.innerText = `البته ${gl.length - 1} چیز دیگه هم هست که بعدا باید ثابت کنی.
      اگه روشون کلیک کنی اول میریم سراغ اونا`;
      d.appendChild(p);
      gl.forEach((g, i) => {
        if (i === 0) return;
        const b = document.createElement('button');
        b.innerText = `${i}: ${g}`;
        b.onclick = () => {
          this.sendTactic(`Focus ${i+1}`);
        };
        d.appendChild(b);
      });
    }
  }

  refreshPallete() {
    if (this.pallete.length != 0) {
      document.getElementById('pallete-div').style.display = 'block';
    }
    for (const p of this.pallete) {
      const c = document.createElement('button');
      c.innerText = p.label;
      c.title = p.type;
      c.onclick = dragOnClick({ type: 'lem', name: p.name });
      this.dom.pallete.appendChild(c);
    }
  }

  refreshTools() {
    document.getElementById('tool-div').style.display = 'block';
    const {
      rewrite, auto, assert, replace, custom, destruct, revert,
      remember,
    } = this.tools;
    const off = (id) => {
      document.getElementById(id).style.display = 'none';
    };
    const offL = (id) => {
      off(`tool-${id}`);
      off(`tool-${id}-label`);
    };
    if (rewrite === 'disable') offL('rewrite');
    if (replace === 'disable') offL('replace');
    if (destruct === 'disable') offL('destruct');
    if (revert === 'disable') offL('revert');
    if (auto === 'disable') off('tool-auto-button');
    if (assert === 'disable') off('tool-assert-button');
    if (remember === 'disable') off('tool-remember-button');
    if (custom === 'disable') off('tool-custom-button');
  }

  async init(course, problem) {
    const { 
      goal, token, pallete, statement, tools, ok,
    } = await ftc({ type: "create", course, problem });
    if (!ok) {
      alert('مرحله مورد نظر یافت نشد. یا لینک اشتباه است یا مراحل تمام شده. در هر صورت این صفحه را ببندید.');
      return;
    }
    this.goal = goal;
    this.token = token;
    this.pallete = pallete;
    this.problem = problem;
    this.course = course;
    this.tools = tools;
    this.statement = statement.replace(/\n\n/g, '#x#').replace(/\n/g, ' ').replace(/#x#/g, '\n'); 
    this.dom.statement.innerText = this.statement;
    console.log(this);
    this.refreshTools();
    this.refreshGoal();
    this.refreshPallete();
  }

  async sendTactic(tac) {
    const withEnding = !tac.startsWith('revert') && !tac.startsWith('Back');
    const e = withEnding ? this.ending : '';
    const { ok, reason, goal } = await ftc({
      token: this.token, type: 'sendTactic', tac: tac + e
    });
    if (ok) {
      this.goal = goal;
      this.refreshGoal();
    } else {
      alert(reason);
    }
  }

};
