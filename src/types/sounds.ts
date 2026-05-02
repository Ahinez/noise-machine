export type Static = {
  id: number;
  name: string;
  source: string;
};

export type Dynamic = {
  isPlaying: boolean;
  volume: number;
};

export type Sound = Static & Dynamic;
