import type { GhostData, LeaderboardEntry } from '../types';

const NS = 'tribe-racer.v1';

const key = (trackId: number, type: string) => `${NS}.track.${trackId}.${type}`;

const read = <T>(k: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T>(k: string, value: T) => {
  localStorage.setItem(k, JSON.stringify(value));
};

export const getBestTime = (trackId: number) => read<number | null>(key(trackId, 'bestTime'), null);
export const setBestTime = (trackId: number, value: number) => write(key(trackId, 'bestTime'), value);

export const getLeaderboard = (trackId: number) =>
  read<LeaderboardEntry[]>(key(trackId, 'leaderboard'), []).sort((a, b) => a.timeMs - b.timeMs);

export const saveLeaderboardRun = (trackId: number, entry: LeaderboardEntry) => {
  const next = [...getLeaderboard(trackId), entry].sort((a, b) => a.timeMs - b.timeMs).slice(0, 10);
  write(key(trackId, 'leaderboard'), next);
  return next;
};

export const qualifiesTop10 = (trackId: number, timeMs: number) => {
  const board = getLeaderboard(trackId);
  if (board.length < 10) return true;
  return timeMs < board[board.length - 1].timeMs;
};

export const getGhost = (trackId: number) => read<GhostData | null>(key(trackId, 'ghost'), null);
export const setGhost = (trackId: number, ghost: GhostData) => write(key(trackId, 'ghost'), ghost);
