import { Session } from "./clientSession.mjs";
import { registerDropHandler, registerClickHandler } from "./dragndrop.mjs";

let session;

let ending = '; normalize';

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
    await session.sendTactic(`replace (${f}) with (${r}) ${inFolan} ${ending}`);
    return true;
  }
  if (tool === 'destruct') {
    if (item.type === 'hyp') {
      await session.sendTactic(`destruct ${item.name} ${ending}`);
      return true;
    }
  }
  return false;
});

registerDropHandler(async (drag, drop, shift) => {
  const tool = document.querySelector('input[name="tool"]:checked').value;
  if (drop.type === 'goal' || drop.type === 'hyp') {
    const inFolan = drop.type === 'goal' ? ending : `in ${drop.name} ${ending}`;
    if (drag.type === 'hyp' || drag.type === 'lem') {
      if (shift) {
        const f = window.prompt('با چه پارامتر هایی اعمال کنم؟');
        await session.sendTactic(`${tool} ${drag.name} with (${f}) ${inFolan}`);
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
  await session.sendTactic(`assert (${f}) ${ending}`);
};

document.getElementById('tool-custom-button').onclick = async () => {
  const f = window.prompt('تاکتیک کاستوم را وارد کنید');
  await session.sendTactic(`${f} ${ending}`);
};
