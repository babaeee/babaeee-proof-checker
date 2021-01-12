import { Session } from "./clientSession.mjs";
import { registerDropHandler, registerClickHandler } from "./dragndrop.mjs";

let session;

const startSession = async () => {
  session = new Session();
  const sp = window.location.search.split('&');
  if (sp.length !== 2) window.location = '?c=basic&l=2';
  const [c, p] = sp;
  await session.init(c.slice(3), Number(p.slice(2)));
};

registerClickHandler(async (item) => {
  const tool = document.querySelector('input[name="tool"]:checked').value;
  const inFolan = item.type === 'goal' ? '' : `in ${item.name}`;
  if (tool === 'replace') {
    const f = window.prompt('چی باید پیدا شه؟');
    const r = window.prompt('چی باید بره جاش؟');
    await session.sendTactic(`replace (${f}) with (${r}) ${inFolan}`);
    return true;
  }
  if (tool === 'destruct' || tool === 'revert') {
    if (item.type === 'hyp') {
      await session.sendTactic(`${tool} ${item.name}`);
      return true;
    } else {
      alert('این کار روی هدف قابل انجام نیست');
      return true;
    }
  }
  return false;
});

registerDropHandler(async (drag, drop, shift) => {
  const tool = document.querySelector('input[name="tool"]:checked').value;
  if (drop.type === 'goal' || drop.type === 'hyp') {
    const inFolan = drop.type === 'goal' ? '' : `in ${drop.name}`;
    if (drag.type === 'hyp' || drag.type === 'lem') {
      if (shift) {
        const f = window.prompt('با چه پارامتر هایی اعمال کنم؟ (چند پارامتر رو با ویرگول جدا کنید)');
        const w = f.split(',').map((x)=>`(${x})`).join(' ');
        await session.sendTactic(`${tool} ${drag.name} with ${w} ${inFolan}`);
      }
      else {
        await session.sendTactic(`${tool} ${drag.name} ${inFolan}`);
      }
      return;
    }
  }
  alert('متوجه نشدم. اگه درگ اند دراپ واقعی بود ماوس رو ورود ممنوع می کردم تا نشه دراپ کنی');
});

startSession();

document.getElementById('tool-auto-button').onclick = () => {
  session.sendTactic('kalbas_auto');
};

document.getElementById('tool-undo-button').onclick = () => {
  session.sendTactic('Back');
};


document.getElementById('tool-assert-button').onclick = async () => {
  const f = window.prompt('گزاره ادعایی رو وارد کنید');
  await session.sendTactic(`assert (${f})`);
};

document.getElementById('tool-remember-button').onclick = async () => {
  const name = window.prompt('اسمش چی باشه؟');
  const value = window.prompt('مقدارش چی باشه؟');
  await session.sendTactic(`remember (${value}) as ${name}`);
};

document.getElementById('tool-custom-button').onclick = async () => {
  const f = window.prompt('تاکتیک کاستوم را وارد کنید');
  await session.sendTactic(`${f}`);
};
