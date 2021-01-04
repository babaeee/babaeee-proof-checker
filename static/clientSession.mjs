import { dragOnClick } from "./dragndrop.mjs";

const ftc = async (body) => {
  const res = await fetch("/api", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const Session = class {
  constructor() {
    this.state = '';
    this.token = '';
    this.goal = {};
    this.pallete = [];
    this.dom = {
      state: document.getElementById('state'),
      pallete: document.getElementById('pallete'),
    };
  }

  refreshGoal() {
    if (this.goal.finished) {
      alert('جناب مبارکه. اثبات تموم شد. صفحه ریلود می شه.');
      window.location.reload();
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
    for (const p of this.pallete) {
      const c = document.createElement('button');
      c.innerText = p.name;
      c.title = p.type;
      c.onclick = dragOnClick({ type: 'lem', name: p.name });
      this.dom.pallete.appendChild(c);
    }
  }

  async init(problem) {
    const { goal, token, pallete } = await ftc({ type: "create", problem });
    this.goal = goal;
    this.token = token;
    this.pallete = pallete;
    this.refreshGoal();
    this.refreshPallete();
  }

  async sendTactic(tac) {
    const { ok, reason, goal } = await ftc({ token: this.token, type: 'sendTactic', tac });
    if (ok) {
      this.goal = goal;
      this.refreshGoal();
    } else {
      alert(reason);
    }
  }

};
