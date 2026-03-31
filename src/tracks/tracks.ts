import type { TrackConfig, Vec2 } from '../types';

const makeCheckpoints = (points: Vec2[], step = 2) => {
  const checkpoints = [];
  let id = 0;
  for (let i = 0; i < points.length; i += step) {
    checkpoints.push({ id, x: points[i][0], z: points[i][1], radius: 8 - Math.min(id, 3) });
    id += 1;
  }
  return checkpoints;
};

const t = (id: number, name: string, difficulty: string, points: Vec2[], roadWidth: number): TrackConfig => ({
  id,
  name,
  difficulty,
  points,
  roadWidth,
  closed: true,
  startIndex: 0,
  checkpoints: makeCheckpoints(points, Math.max(2, Math.floor(points.length / 6))),
});

export const TRACKS: TrackConfig[] = [
  t(1, 'Rookie Oval', 'Very Easy', [[0, 0], [30, 0], [45, 15], [30, 30], [0, 30], [-15, 15]], 12),
  t(2, 'Breeze Bend', 'Easy', [[0, 0], [35, -5], [60, 15], [50, 40], [15, 50], [-20, 30], [-15, 10]], 11),
  t(3, 'Chicane School', 'Easy+', [[0, 0], [28, -8], [50, 0], [62, 20], [35, 35], [15, 25], [0, 45], [-20, 30], [-25, 10]], 10),
  t(4, 'Switchback Sprint', 'Medium', [[0, 0], [30, -10], [65, -5], [70, 20], [45, 35], [60, 55], [35, 70], [5, 62], [-20, 45], [-25, 20]], 9.5),
  t(5, 'Ridge Run', 'Medium+', [[0, 0], [35, -12], [70, 0], [85, 25], [65, 48], [40, 65], [15, 78], [-10, 68], [-28, 48], [-40, 20], [-20, -5]], 9),
  t(6, 'Link Complex', 'Technical', [[0, 0], [28, -15], [55, -10], [75, 10], [80, 35], [60, 50], [35, 45], [20, 65], [-5, 75], [-30, 60], [-45, 35], [-35, 10], [-18, -5]], 8.5),
  t(7, 'Longline Circuit', 'Hard', [[0, 0], [35, -20], [75, -15], [105, 5], [115, 30], [95, 55], [65, 72], [35, 88], [5, 92], [-25, 75], [-45, 45], [-55, 10], [-35, -10]], 8),
  t(8, 'Velocity Trap', 'Hard+', [[0, 0], [40, -25], [90, -20], [120, 0], [130, 30], [110, 58], [70, 75], [40, 95], [10, 110], [-20, 95], [-45, 65], [-65, 28], [-60, -5], [-30, -20]], 7.5),
  t(9, 'Needle Pass', 'Expert', [[0, 0], [35, -30], [85, -30], [125, -10], [140, 20], [130, 55], [102, 82], [65, 102], [30, 120], [-5, 130], [-35, 116], [-60, 88], [-82, 55], [-90, 15], [-75, -18], [-40, -28]], 7),
  t(10, 'Master Gauntlet', 'Legendary', [[0, 0], [40, -35], [95, -40], [145, -20], [175, 10], [182, 45], [165, 82], [130, 110], [92, 130], [58, 145], [20, 158], [-20, 152], [-55, 135], [-88, 108], [-115, 72], [-130, 32], [-125, -8], [-95, -32], [-55, -42]], 6.5),
];

export const getTrackById = (id: number) => TRACKS.find((track) => track.id === id);
