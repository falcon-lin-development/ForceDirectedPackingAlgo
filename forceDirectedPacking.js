import { checkOverlapping } from './utils.js';

// Simple force-directed algorithm
export async function forceDirectedPacking(rectangles, iterations, reRenderPage){
  // const repulsionForce = 10;
  const containerWidth = 600;
  const containerHeight = 1000;
  const marginThreshold = 2; // Margin to check for overlapping
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
      i,
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
