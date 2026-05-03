import { useEffect, useRef, type RefObject } from "react";

const WaveCanvas = ({
  analyserRef,
}: {
  analyserRef: RefObject<AnalyserNode | null>;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync canvas logical size with its CSS size (handles DPR and resize)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sync = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Continuous draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;

    const draw = () => {
      const analyser = analyserRef.current;
      if (!analyser) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width;
      const h = canvas.height;

      const dataArray = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#eff1f5";
      ctx.fillRect(0, 0, w, h);

      ctx.beginPath();
      ctx.strokeStyle = "#8839ef";
      ctx.lineWidth = 2.5 * dpr;
      ctx.lineJoin = "round";

      dataArray.forEach((value, index) => {
        const x = (index / dataArray.length) * w;
        const y = ((value - 128) / 128) * (h / 2) + h / 2;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();
      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [analyserRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "calc(100dvh - 90px)",
        display: "block",
      }}
    />
  );
};

export default WaveCanvas;
