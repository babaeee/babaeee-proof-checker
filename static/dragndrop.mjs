let state = 'drag';
let draggedItem = {};
let dropHandler = () => {};
let clickHandler = () => { return false };
let shiftHolded = false;
const dom = document.getElementById('drag-label');

document.onkeydown = (e) => {
  if (e.key === 'Shift') {
    shiftHolded = true;
  }
};

document.onkeyup = (e) => {
  if (e.key === 'Shift') {
    shiftHolded = false;
  }
};

export const dragOnClick = (e) => async () => {
  if (state === 'drag') {
    draggedItem = e;
    if (await clickHandler(e, shiftHolded)) {
      shiftHolded = false;
      return;
    }
    dom.innerText = 'مثلا درگ کردی. حالا یه جا کلیک کن تا دراپ شه.';
    state = 'drop';
  } else {
    state = 'drag';
    dom.innerText = '';
    const sh = shiftHolded;
    shiftHolded = false;
    dropHandler(draggedItem, e, sh);
  }
};

export const registerClickHandler = (f) => {
  clickHandler = f;  
};

export const registerDropHandler = (f) => {
  dropHandler = f;  
};
