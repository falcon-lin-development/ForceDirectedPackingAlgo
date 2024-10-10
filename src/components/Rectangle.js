import React from 'react';

const Rectangle = ({ x, y, width, height }) => (
  <div
    className="rectangle"
    style={{
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
      border: '1px solid #333',
      backgroundColor: 'rgba(0, 123, 255, 0.5)',
    }}
  />
);

export default Rectangle;
