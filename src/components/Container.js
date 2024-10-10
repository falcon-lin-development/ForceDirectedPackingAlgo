import React, { useState, useEffect } from 'react';
import Rectangle from './Rectangle';
// import { forceDirectedPacking } from '../utils/forceDirectedPacking';
import { rectanglePacking } from '../utils/rectPacking';
import { Rectangle as RectangleClass } from '../utils/Rectangle';

const Container = () => {
  const [rectangles, setRectangles] = useState(() => {
    const containerWidth = 600;
    const containerHeight = 1000;
    const minSize = 50;
    const maxSize = 150;

    return Array.from({ length: 10 }, () => {
      const width = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
      const height = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
      const x = Math.floor(Math.random() * (containerWidth - width + 1));
      const y = Math.floor(Math.random() * (containerHeight - height + 1));

      return new RectangleClass(x, y, width, height);
    });
  });

  useEffect(() => {
    const runPacking = async () => {
      await rectanglePacking(rectangles, 500, () => setRectangles([...rectangles]));
    };
    runPacking();
  }, []);

  return (
    <div id="container" style={{ width: '600px', height: '1000px', border: '1px solid black', position: 'relative' }}>
      {rectangles.map((rect, index) => (
        <Rectangle key={index} {...rect} />
      ))}
    </div>
  );
};

export default Container;
