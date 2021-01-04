let state = 'drag';
let draggedItem = {};
let dragHandler = () => {};

const dom = document.getElementById('drag-label');

export const dragOnClick = (e) => () => {
  if (state === 'drag') {
    draggedItem = e;
    dom.innerText = 'مثلا درگ کردی. حالا یه جا کلیک کن تا دراپ شه.';
    state = 'drop';
  } else {
    state = 'drag';
    dom.innerText = '';
    dragHandler(draggedItem, e);
  }
};

export const registerDragHandler = (f) => {
  dragHandler = f;  
};
