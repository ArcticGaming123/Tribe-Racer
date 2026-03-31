export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export interface Checkpoint {
  id: number;
  x: number;
  z: number;
  radius: number;
}

export interface TrackConfig {
  id: number;
  name: string;
  difficulty: string;
  roadWidth: number;
  closed: boolean;
  points: Vec2[];
  startIndex: number;
  checkpoints: Checkpoint[];
}

export interface LeaderboardEntry {
  name: string;
  timeMs: number;
  createdAt: number;
}

export interface GhostSample {
  t: number;
  position: Vec3;
  rotationY: number;
}

export interface GhostData {
  durationMs: number;
  samples: GhostSample[];
}
