import { checkOverlapping } from './utils.js';

export async function rectanglePacking(rectangles, iterations, reRenderPage) {
  const containerWidth = 600;
  const containerHeight = 1000;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const marginThreshold = 2;

  // Sort rectangles by area (descending)
  rectangles.sort((a, b) => (b.width * b.height) - (a.width * a.height));

  // Place the largest rectangle at the center
  const largestRect = rectangles[0];
  largestRect.x = centerX - largestRect.width / 2;
  largestRect.y = centerY - largestRect.height / 2;

  function placeRectangle(rect) {
    let angle = 0;
    let distance = 0;
    const stepAngle = Math.PI / 180; // 1 degree in radians
    const stepDistance = 1;

    while (true) {
      rect.x = centerX + Math.cos(angle) * distance - rect.width / 2;
      rect.y = centerY + Math.sin(angle) * distance - rect.height / 2;

      if (isValidPlacement(rect)) {
        return true;
      }

      angle += stepAngle;
      if (angle >= Math.PI * 2) {
        angle = 0;
        distance += stepDistance;
      }

      if (distance > Math.max(containerWidth, containerHeight)) {
        return false; // Couldn't place the rectangle
      }
    }
  }

  function isValidPlacement(rect) {
    if (rect.x < 0 || rect.y < 0 || 
        rect.x + rect.width > containerWidth || 
        rect.y + rect.height > containerHeight) {
      return false;
    }

    for (let other of rectangles) {
      if (other === rect) continue;
      if (checkOverlapping(rect, other, marginThreshold).overlapping) {
        return false;
      }
    }

    return true;
  }

  for (let i = 1; i < rectangles.length; i++) {
    if (!placeRectangle(rectangles[i])) {
      console.warn(`Couldn't place rectangle ${i}`);
    }
    reRenderPage();
    await new Promise(resolve => requestAnimationFrame(resolve));
  }

  function optimizePlacements() {
    for (let i = 1; i < rectangles.length; i++) {
      const rect = rectangles[i];
      const originalX = rect.x;
      const originalY = rect.y;

      // Try to move slightly closer to the center
      const dx = centerX - (rect.x + rect.width / 2);
      const dy = centerY - (rect.y + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const moveX = (dx / distance) * 1; // Move by 1 pixel
        const moveY = (dy / distance) * 1;

        rect.x += moveX;
        rect.y += moveY;

        if (!isValidPlacement(rect)) {
          rect.x = originalX;
          rect.y = originalY;
        }
      }
    }
  }

  for (let i = 0; i < iterations; i++) {
    optimizePlacements();
    reRenderPage();
    await new Promise(resolve => requestAnimationFrame(resolve));
  }
}