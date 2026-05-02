import { useEffect, useRef, type RefObject } from "react";

const WaveCanvas = ({
  analyser,
  isPlaying,
}: {
  analyser: RefObject<AnalyserNode | null>;
  isPlaying: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!analyser.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const dataArray = new Uint8Array(analyser.current.fftSize);

    const draw = () => {
      if (!ctx || !canvas) return;

      analyser.current?.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      dataArray.forEach((value, index) => {
        const x = (index / dataArray.length) * canvas.width;
        const y = (value / 128) * (canvas.height / 2);
        index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      requestAnimationFrame(draw);
    };
    draw();
  }, [isPlaying]);

  return <canvas ref={canvasRef} />;
};

export default WaveCanvas;
