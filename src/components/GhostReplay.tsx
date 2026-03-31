import { useMemo } from 'react';
import * as THREE from 'three';
import type { GhostData } from '../types';

interface GhostReplayProps {
  ghost: GhostData;
  elapsedMs: number;
  active: boolean;
}

export const GhostReplay = ({ ghost, elapsedMs, active }: GhostReplayProps) => {
  const transform = useMemo(() => {
    if (!active || ghost.samples.length < 2) return null;

    const t = Math.min(elapsedMs, ghost.durationMs);
    let idx = ghost.samples.findIndex((s) => s.t >= t);
    if (idx <= 0) idx = 1;
    if (idx >= ghost.samples.length) idx = ghost.samples.length - 1;
    const a = ghost.samples[idx - 1];
    const b = ghost.samples[idx];
    const alpha = THREE.MathUtils.clamp((t - a.t) / Math.max(1, b.t - a.t), 0, 1);

    return {
      pos: new THREE.Vector3(
        THREE.MathUtils.lerp(a.position[0], b.position[0], alpha),
        THREE.MathUtils.lerp(a.position[1], b.position[1], alpha),
        THREE.MathUtils.lerp(a.position[2], b.position[2], alpha)
      ),
      rotY: THREE.MathUtils.lerp(a.rotationY, b.rotationY, alpha),
    };
  }, [active, elapsedMs, ghost]);

  if (!transform) return null;

  return (
    <group position={transform.pos} rotation={[0, transform.rotY, 0]}>
      <mesh>
        <boxGeometry args={[1.4, 0.6, 2.8]} />
        <meshStandardMaterial color="#58a6ff" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 0.4, -0.2]}>
        <boxGeometry args={[1.1, 0.4, 1.3]} />
        <meshStandardMaterial color="#9ecbff" transparent opacity={0.25} />
      </mesh>
    </group>
  );
};
