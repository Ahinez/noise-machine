import { useEffect, useRef, type RefObject } from "react";

type Return = {
  pause: () => void;
  resume: () => void;
  analyser: RefObject<AnalyserNode | null>;
  setVolume: (volume: number) => void;
};

export const useAudio = (source: string): Return => {
  const contextRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const context = new AudioContext();
    contextRef.current = context;

    const load = async () => {
      const response = await fetch(source);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);

      bufferRef.current = context.createBufferSource();
      gainRef.current = context.createGain();
      analyserRef.current = context.createAnalyser();

      bufferRef.current.buffer = audioBuffer;
      bufferRef.current.loop = true;

      bufferRef.current.connect(gainRef.current);
      gainRef.current.connect(analyserRef.current);
      analyserRef.current.connect(context.destination);

      bufferRef.current?.start();
    };
    load();

    return () => {
      context.close();
    };
  }, []);

  return {
    pause: () => {
      contextRef.current?.suspend();
    },
    resume: () => {
      contextRef.current?.resume();
    },
    setVolume: (volume: number) => {
      if (gainRef.current) {
        gainRef.current.gain.value = volume;
      }
    },
    analyser: analyserRef,
  };
};
