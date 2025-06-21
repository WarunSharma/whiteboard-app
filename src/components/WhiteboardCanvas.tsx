import React, { useRef, useState } from "react";

function WhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [isEraser, setIsEraser] = useState(false);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = isEraser ? "#ffffff" : color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    }
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.lineTo(offsetX, offsetY);
    ctx?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.closePath();
  };

  return (
    <>
      <div style={{ padding: "10px", display: "flex", gap: "10px" }}>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={isEraser}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        />
        <button onClick={() => setIsEraser(false)}>✏️ Pen</button>
        <button onClick={() => setIsEraser(true)}>🧽 Eraser</button>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: "10px solid #ccc",
          boxSizing: "border-box",
          cursor: "crosshair",
        }}
      />
    </>
  );
}

export default WhiteboardCanvas;
