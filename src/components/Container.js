import React, { useState, useEffect } from 'react';
import Rectangle from './Rectangle';
import { forceDirectedPacking } from '../utils/forceDirectedPacking';
import { Rectangle as RectangleClass } from '../utils/Rectangle';

const Container = () => {
  const [rectangles, setRectangles] = useState([
    new RectangleClass(50, 50, 100, 80),
    new RectangleClass(200, 100, 120, 60),
    new RectangleClass(100, 200, 80, 100),
    new RectangleClass(300, 150, 90, 90)
  ]);

  useEffect(() => {
    const runPacking = async () => {
      await forceDirectedPacking(rectangles, 500, () => setRectangles([...rectangles]));
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
