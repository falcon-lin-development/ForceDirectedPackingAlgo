// Basic rectangle class
class Rectangle {
  constructor(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

// Simple force-directed algorithm
async function forceDirectedPacking(rectangles, iterations = 500){
  // const repulsionForce = 10;
  const containerWidth = 600;
  const containerHeight = 1000;
  const marginThreshold = 2; // Margin to check for overlapping
  const delay = 16; // Delay in milliseconds between iterations
  const minMoveThreshold = 0.04; // stablize the transition
  // stopping conditions
  const stabilityIterations = 15; // Number of iterations to check for stability

  let stableIterations = 0;


  for (let i = 0; i<iterations; i++){
   let totalChange = 0;
    let maxChange = 0;
    const originalPositions = rectangles.map(rect => ({ x: rect.x, y: rect.y }));

    for (let a of rectangles){
      for (let b of rectangles){
        if (a!==b){
          // Calculate distance between centers
          const dx = (b.x + b.width / 2) - (a.x + a.width / 2);
          const dy = (b.y + b.width / 2) - (a.y + a.height / 2);
          const distance = Math.sqrt(dx * dx + dy * dy); // Pythagoras Thms
          const overlaps = checkOverlapping(a, b, marginThreshold);
          const isOverlapping = overlaps.overlapping;

          // Apply repulsion force
          if (isOverlapping){
            const repulsionForce = 1 / (distance + 1); // Distance-dependent force
            const forceX = dx * repulsionForce / 2;
            const forceY = dy * repulsionForce / 2;

            if(Math.abs(forceX) >= minMoveThreshold){
              a.x -= forceX;
              b.x += forceX;
            }
            if(Math.abs(forceY) >= minMoveThreshold){
              a.y -= forceY;
              b.y += forceY;
            }
          }

          // Apply attraction force
          if (!isOverlapping){
            const attractionForce = 1 / (distance + 1); // Distance-dependent force
            const forceX = dx * attractionForce / 2;
            const forceY = dy * attractionForce / 2;


            if(Math.abs(forceX) >= minMoveThreshold){
              a.x += forceX;
              b.x -= forceX;
            }
            if(Math.abs(forceY) >= minMoveThreshold){
              a.y += forceY;
              b.y -= forceY;
            }
          }
        }
      }

      // Keep reactangles widthin container
      a.x = Math.max(0, Math.min(a.x, containerWidth - a.width));
      a.y = Math.max(0, Math.min(a.y, containerHeight - a.height));
    }

    // Calculate changes in position
    rectangles.forEach((rect, index) => {
      const originalPos = originalPositions[index];
      const change = Math.sqrt(
        Math.pow(rect.x - originalPos.x, 2) + Math.pow(rect.y - originalPos.y, 2)
      );
      totalChange += change;
      maxChange = Math.max(maxChange, change);
    });

    const avgChange = totalChange / rectangles.length;
    console.log({
      counter,
      maxChange,
      avgChange,
      stableIterations
    });
    reRenderPage();

    await new Promise(resolve => requestAnimationFrame(resolve));


    // Check if changes are negligible
    if (maxChange <= 2 && avgChange <= 0.8) {
      stableIterations++;
      if (stableIterations >= stabilityIterations) {
        console.log(`Stopping early at iteration ${i + 1}. System has stabilized.`);
        break;
      }
    } else {
      stableIterations = 0;
    }
  }
}

// helpers
function checkOverlapping(rect1, rect2, margin = 0){
  // Calculate centers of rectangles
  const center1 = {
    x: rect1.x + rect1.width / 2,
    y: rect1.y + rect1.height / 2
  };
  const center2 = {
    x: rect2.x + rect2.width / 2,
    y: rect2.y + rect2.height / 2
  };

  // Calculate half-widths and half-heights (including margin)
  const halfWidth1 = rect1.width / 2 + margin;
  const halfHeight1 = rect1.height / 2 + margin;
  const halfWidth2 = rect2.width / 2 + margin;
  const halfHeight2 = rect2.height / 2 + margin;

  // Calculate the distance between centers
  const dx = Math.abs(center2.x - center1.x);
  const dy = Math.abs(center2.y - center1.y);

  // Check for overlap
  if (dx < halfWidth1 + halfWidth2 && dy < halfHeight1 + halfHeight2) {
    // Calculate overlap amounts
    const overlapX = halfWidth1 + halfWidth2 - dx;
    const overlapY = halfHeight1 + halfHeight2 - dy;

    return {
      overlapping: true,
      overlapX: overlapX,
      overlapY: overlapY
    };
  }

  return {
    overlapping: false,
    overlapX: 0,
    overlapY: 0
  };
}


const rectangles = [
  new Rectangle(50, 50, 100, 80),
  new Rectangle(200, 100, 120, 60),
  new Rectangle(100, 200, 80, 100),
  new Rectangle(300, 150, 90, 90)
];


let counter = 0;
function reRenderPage(){
  counter++;
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


function initRenderPage(){
  counter++;
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
  await forceDirectedPacking(rectangles);
}

init();
