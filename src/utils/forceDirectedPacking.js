import { checkOverlapping } from './utils.js';

export async function forceDirectedPacking(rectangles, iterations, reRenderPage) {
  const containerWidth = 600;
  const containerHeight = 1000;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const marginThreshold = 5;
  const stabilityIterations = 15;
  const attractionStrength = 0.05;
  const repulsionStrength = 500;

  let stableIterations = 0;

  // Find the largest rectangle
  const largestRectIndex = rectangles.reduce((maxIndex, rect, currentIndex, arr) => 
    rect.width * rect.height > arr[maxIndex].width * arr[maxIndex].height ? currentIndex : maxIndex
  , 0);

  // Place the largest rectangle at the center
  const largestRect = rectangles[largestRectIndex];
  largestRect.x = centerX - largestRect.width / 2;
  largestRect.y = centerY - largestRect.height / 2;

  function applyForces() {
    for (let i = 0; i < rectangles.length; i++) {
      if (i === largestRectIndex) continue;
      const rect = rectangles[i];
      
      let totalForceX = 0;
      let totalForceY = 0;

      // Attraction to center
      const dx = centerX - (rect.x + rect.width / 2);
      const dy = centerY - (rect.y + rect.height / 2);
      const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
      totalForceX += dx / distanceToCenter * attractionStrength;
      totalForceY += dy / distanceToCenter * attractionStrength;

      // Repulsion from other rectangles
      for (let j = 0; j < rectangles.length; j++) {
        if (i === j) continue;
        const other = rectangles[j];
        const rdx = (other.x + other.width / 2) - (rect.x + rect.width / 2);
        const rdy = (other.y + other.height / 2) - (rect.y + rect.height / 2);
        const distance = Math.sqrt(rdx * rdx + rdy * rdy);
        if (distance > 0) {
          const repulsionForce = repulsionStrength / (distance * distance);
          totalForceX -= (rdx / distance) * repulsionForce;
          totalForceY -= (rdy / distance) * repulsionForce;
        }
      }

      // Apply forces
      rect.x += totalForceX;
      rect.y += totalForceY;

      // Keep rectangles within container
      rect.x = Math.max(0, Math.min(rect.x, containerWidth - rect.width));
      rect.y = Math.max(0, Math.min(rect.y, containerHeight - rect.height));
    }
  }

  function resolveOverlaps() {
    for (let i = 0; i < rectangles.length; i++) {
      if (i === largestRectIndex) continue;
      const rect = rectangles[i];

      for (let j = 0; j < rectangles.length; j++) {
        if (i === j) continue;
        const other = rectangles[j];
        const overlap = checkOverlapping(rect, other, marginThreshold);

        if (overlap.overlapping) {
          const centerDiffX = (other.x + other.width / 2) - (rect.x + rect.width / 2);
          const centerDiffY = (other.y + other.height / 2) - (rect.y + rect.height / 2);
          const distance = Math.sqrt(centerDiffX * centerDiffX + centerDiffY * centerDiffY);
          
          if (distance > 0) {
            const moveX = (centerDiffX / distance) * (overlap.overlapX / 2 + 1);
            const moveY = (centerDiffY / distance) * (overlap.overlapY / 2 + 1);
            
            if (j !== largestRectIndex) {
              rect.x -= moveX / 2;
              rect.y -= moveY / 2;
              other.x += moveX / 2;
              other.y += moveY / 2;
            } else {
              rect.x -= moveX;
              rect.y -= moveY;
            }
          }
        }
      }
    }
  }

  for (let i = 0; i < iterations; i++) {
    const originalPositions = rectangles.map(rect => ({ x: rect.x, y: rect.y }));

    applyForces();
    resolveOverlaps();

    let totalChange = 0;
    let maxChange = 0;

    // Calculate changes in position
    rectangles.forEach((rect, index) => {
      if (index === largestRectIndex) return;
      const originalPos = originalPositions[index];
      const change = Math.sqrt(
        Math.pow(rect.x - originalPos.x, 2) + Math.pow(rect.y - originalPos.y, 2)
      );
      totalChange += change;
      maxChange = Math.max(maxChange, change);
    });

    const avgChange = totalChange / (rectangles.length - 1);
    console.log({ i, maxChange, avgChange, stableIterations });
    reRenderPage();

    await new Promise(resolve => requestAnimationFrame(resolve));

    // Check if changes are negligible
    // if (maxChange <= 0.5 && avgChange <= 0.2) {
    //   stableIterations++;
    //   if (stableIterations >= stabilityIterations) {
    //     console.log(`Stopping early at iteration ${i + 1}. System has stabilized.`);
    //     break;
    //   }
    // } else {
    //   stableIterations = 0;
    // }
  }
}