// helpers
export function checkOverlapping(rect1, rect2, margin = 0){
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
