import { useCallback, useEffect, useRef, useState } from "react";
import type { Static } from "../types/sounds";

export const useAudio = (sounds: Static[], defaultIndex: number) => {
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const indexRef = useRef(defaultIndex);
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);
  const [isPlaying, setIsPlaying] = useState(true);

  const switchTo = useCallback(
    async (index: number) => {
      const context = contextRef.current;
      const gain = gainRef.current;
      if (!context || !gain) return;

      if (sourceRef.current) {
        sourceRef.current.loop = false;
        try {
          sourceRef.current.stop();
        } catch {
          /* already stopped */
        }
        sourceRef.current = null;
      }

      const response = await fetch(sounds[index].source);
      const arrayBuffer = await response.arrayBuffer();

      // Guard: context may have been replaced (e.g. StrictMode remount)
      if (contextRef.current !== context) return;

      const audioBuffer = await context.decodeAudioData(arrayBuffer);

      if (contextRef.current !== context) return;

      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      sourceRef.current = source;

      if (context.state === "suspended") {
        await context.resume();
      }

      indexRef.current = index;
      setCurrentIndex(index);
      setIsPlaying(true);
    },
    [sounds],
  );

  useEffect(() => {
    const context = new AudioContext();
    contextRef.current = context;

    const gain = context.createGain();
    gainRef.current = gain;

    switchTo(defaultIndex);

    return () => {
      context.close();
    };
  }, [switchTo, defaultIndex]);

  return {
    isPlaying,
    currentIndex,
    currentSound: sounds[currentIndex],
    pause: () => {
      contextRef.current?.suspend();
      setIsPlaying(false);
    },
    resume: () => {
      contextRef.current?.resume();
      setIsPlaying(true);
    },
    next: () => switchTo((indexRef.current + 1) % sounds.length),
    prev: () =>
      switchTo((indexRef.current - 1 + sounds.length) % sounds.length),
    setVolume: (volume: number) => {
      if (gainRef.current) gainRef.current.gain.value = volume;
    },
  };
};
