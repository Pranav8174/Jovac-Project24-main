import React from 'react';

function Canvas(props) {
  const { draw, ...rest } = props; 
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

   
    draw(context);

   
    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height); 
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={500} 
      height={500} 
      {...rest}  
    />
  );
}

export default Canvas;
