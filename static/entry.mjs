import { Session } from "./clientSession.mjs";
import { registerDragHandler } from "./dragndrop.mjs";

let session;

const startSession = async () => {
  session = new Session();
  const problem = Number(window.location.search.slice(3));
  await session.init(isNaN(problem) ? 0 : problem);
};

document.getElementById('rg-button').onclick = async () => {
  const f = document.getElementById('rg-box').value;
  await session.sendTactic(`replace_goal (${f})`);
};

registerDragHandler(async (drag, drop, shift) => {
  if (drop.type === 'goal') {
    if (drag.type === 'hyp' || drag.type === 'lem') {
      if (shift) {
        const f = window.prompt('با چه پارامتر هایی اعمال کنم؟');
        await session.sendTactic(`apply ${drag.name} with (${f})`);
      }
      else {
        await session.sendTactic(`apply ${drag.name}`);
      }
      return;
    }
  }
  alert('متوجه نشدم. اگه درگ اند دراپ واقعی بود ماوس رو ورود ممنوع می کردم تا نشه دراپ کنی');
});

startSession();

document.getElementById('auto-proof').onclick = () => {
  session.sendTactic('kalbas_auto');
}
