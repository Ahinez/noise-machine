import { useState } from "react";
import { useAudio } from "../hooks/useAudio";
import type { Static } from "../types/sounds";
import WaveCanvas from "./WaveCanvas";

const SoundCard = (sound: Static) => {
  const { pause, resume, setVolume, analyser } = useAudio(sound.source);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div>
      <WaveCanvas analyser={analyser} isPlaying={isPlaying} />
      <h2>{sound.name}</h2>
      <button
        onClick={() => {
          if (isPlaying) {
            pause();
            setIsPlaying(false);
          } else {
            resume();
            setIsPlaying(true);
          }
        }}
      >
        {isPlaying ? "Пауза" : "Продолжить"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        defaultValue={1}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
    </div>
  );
};

export default SoundCard;
