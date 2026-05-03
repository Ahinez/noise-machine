import { useState } from "react";

type Props = {
  soundName: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onVolume: (volume: number) => void;
};

const PlayerBar = ({
  soundName,
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  onVolume,
}: Props) => {
  const [volume, setVolume] = useState(1);

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    onVolume(v);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(92vw, 560px)",
        borderRadius: "9999px",
        background: "rgba(204, 208, 218, 0.3)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(188, 192, 204, 0.6)",
        display: "flex",
        alignItems: "center",
        padding: "0.5rem 1.25rem",
        gap: "0.5rem",
        boxShadow: "0 4px 24px rgba(76, 79, 105, 0.12)",
      }}
    >
      <Btn onClick={onPrev} title="Previous">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6h2v12H6V6zm3.5 6L18 18V6L9.5 12z" />
        </svg>
      </Btn>

      <Btn
        onClick={onPlayPause}
        title={isPlaying ? "Pause" : "Play"}
        style={{
          background: "rgba(136, 57, 239, 0.12)",
          width: 48,
          height: 48,
        }}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </Btn>

      <Btn onClick={onNext} title="Next">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zm8.5-6V6l-8.5 6 8.5 6V12zm2-6h2v12h-2V6z" />
        </svg>
      </Btn>

      <span
        style={{
          flex: 1,
          textAlign: "center",
          color: "#4c4f69",
          fontSize: "0.875rem",
          fontWeight: 500,
          letterSpacing: "0.03em",
          textTransform: "capitalize",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {soundName}
      </span>

      <input
        className="nm-volume"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={handleVolume}
        title="Volume"
      />
    </div>
  );
};

const Btn = ({
  onClick,
  title,
  style,
  children,
}: {
  onClick: () => void;
  title: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => (
  <button className="nm-btn" onClick={onClick} title={title} style={style}>
    {children}
  </button>
);

export default PlayerBar;
