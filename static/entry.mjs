import { Session } from "./clientSession.mjs";
import { registerDragHandler } from "./dragndrop.mjs";

let session;

const startSession = async () => {
  const value = window.prompt('کدوم سوال رو می خوای ثابت کنی؟');
  session = new Session();
  const problem = (() => {
    if ('hesabi'.startsWith(value)) return 'hesabi';
    return 'fibo';
  })();
  await session.init(problem);
};

document.getElementById('rg-button').onclick = async () => {
  const f = document.getElementById('rg-box').value;
  await session.sendTactic(`replace_goal (${f})`);
};

registerDragHandler(async (drag, drop) => {
  if (drop.type === 'goal') {
    if (drag.type === 'hyp' || drag.type === 'lem') {
      await session.sendTactic(`apply ${drag.name}`);
      return;
    }
  }
  alert('متوجه نشدم. اگه درگ اند دراپ واقعی بود نمی ذاشتم دراپ کنی');
});

startSession();
