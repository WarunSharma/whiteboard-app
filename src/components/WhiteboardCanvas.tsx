import React, { useRef, useState } from "react";

function WhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setHistory((prev) => [...prev, dataUrl]);
  };

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
    saveSnapshot();
    setIsDrawing(true);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "whiteboard.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = new Image();
    img.src = last;
    img.onload = () => {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHistory((prev) => prev.slice(0, -1));
      }
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHistory([]);
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
        <button onClick={downloadImage}>⬇️ Download</button>
        <button onClick={clearCanvas}>🧹 Clear</button>
        <button onClick={undo}>↩️ Undo</button>
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
