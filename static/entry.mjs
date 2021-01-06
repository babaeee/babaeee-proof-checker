import { Session } from "./clientSession.mjs";
import { registerDragHandler } from "./dragndrop.mjs";

let session;

const startSession = async () => {
  session = new Session();
  const problem = Number(window.location.search.slice(3));
  await session.init(isNaN(problem) ? 0 : problem);
};

registerDragHandler(async (drag, drop, shift) => {
  const tool = document.querySelector('input[name="tool"]:checked').value;
  if (drop.type === 'goal' || drop.type === 'hyp') {
    const inFolan = drop.type === 'goal' ? '' : `in ${drop.name}`;
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
  await session.sendTactic(`assert (${f})`);
};
