import * as THREE from 'three';
import type { Vec2 } from '../types';

export const projectToTrack = (x: number, z: number, points: Vec2[]) => {
  let bestDist = Number.POSITIVE_INFINITY;
  let best = new THREE.Vector2(points[0][0], points[0][1]);

  for (let i = 0; i < points.length; i += 1) {
    const a = new THREE.Vector2(points[i][0], points[i][1]);
    const bRaw = points[(i + 1) % points.length];
    const b = new THREE.Vector2(bRaw[0], bRaw[1]);
    const ab = b.clone().sub(a);
    const t = THREE.MathUtils.clamp(new THREE.Vector2(x, z).sub(a).dot(ab) / ab.lengthSq(), 0, 1);
    const p = a.clone().add(ab.multiplyScalar(t));
    const d = p.distanceToSquared(new THREE.Vector2(x, z));
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }

  return { point: best, dist: Math.sqrt(bestDist) };
};

export const withinCheckpoint = (x: number, z: number, cx: number, cz: number, radius: number) => {
  const dx = x - cx;
  const dz = z - cz;
  return dx * dx + dz * dz <= radius * radius;
};
