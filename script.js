import { Rectangle } from './Rectangle.js';
import { forceDirectedPacking } from './forceDirectedPacking.js';

const rectangles = [
  new Rectangle(50, 50, 100, 80),
  new Rectangle(200, 100, 120, 60),
  new Rectangle(100, 200, 80, 100),
  new Rectangle(300, 150, 90, 90)
];

function getReRenderPage(){
  let counter = 0;
  function reRenderPage(){
    counter++;
    console.log({counter});
    requestAnimationFrame(() => {
        const rectEls = document.querySelectorAll(".rectangle");
        rectEls.forEach((el, i) => {
          const rect = rectangles[i];
          el.style.left = `${rect.x}px`;
          el.style.top = `${rect.y}px`;
          el.style.width = `${rect.width}px`;
          el.style.height = `${rect.height}px`;
        });
      });
  }

  return reRenderPage;
}



function initRenderPage(){
  const container = document.getElementById("container");
  rectangles.forEach(rect => {
    const el = document.createElement('div');
    el.classList.add("rectangle");
    el.style.left = `${rect.x}px`;
    el.style.top = `${rect.y}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    container.appendChild(el);
  })
}

async function init() {
  initRenderPage();
  await forceDirectedPacking(rectangles, 500, getReRenderPage());
}

init();
