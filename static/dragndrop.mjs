let state = 'drag';
let draggedItem = {};
let dragHandler = () => {};
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

export const dragOnClick = (e) => () => {
  if (state === 'drag') {
    draggedItem = e;
    dom.innerText = 'مثلا درگ کردی. حالا یه جا کلیک کن تا دراپ شه.';
    state = 'drop';
  } else {
    state = 'drag';
    dom.innerText = '';
    dragHandler(draggedItem, e, shiftHolded);
  }
};

export const registerDragHandler = (f) => {
  dragHandler = f;  
};
