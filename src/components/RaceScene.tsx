import type React from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Environment, Line } from '@react-three/drei';
import type { GhostData, TrackConfig } from '../types';
import { projectToTrack, withinCheckpoint } from '../game/math';
import { GhostReplay } from './GhostReplay';

interface RaceSceneProps {
  track: TrackConfig;
  ghost: GhostData | null;
  paused: boolean;
  onEsc: () => void;
  onRunComplete: (timeMs: number, ghostData: GhostData) => void;
  speedCallback: (speedKmh: number) => void;
  timerCallback: (elapsedMs: number, running: boolean) => void;
}

interface KeyState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}

const TrackMesh = ({ track }: { track: TrackConfig }) => {
  const roadSegments = useMemo(() => {
    const segments: React.ReactNode[] = [];
    for (let i = 0; i < track.points.length; i += 1) {
      const a = track.points[i];
      const b = track.points[(i + 1) % track.points.length];
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const length = Math.sqrt(dx * dx + dz * dz);
      const midX = (a[0] + b[0]) / 2;
      const midZ = (a[1] + b[1]) / 2;
      const angle = Math.atan2(dx, dz);
      segments.push(
        <mesh key={`road-${i}`} position={[midX, 0, midZ]} rotation={[0, angle, 0]}>
          <boxGeometry args={[track.roadWidth, 0.2, length + 1]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
      );

      const wallOffset = track.roadWidth / 2 + 0.8;
      [wallOffset, -wallOffset].forEach((offset, j) => {
        segments.push(
          <mesh
            key={`wall-${i}-${j}`}
            position={[midX + Math.cos(angle) * offset, 1, midZ - Math.sin(angle) * offset]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[1, 2, length + 1]} />
            <meshStandardMaterial color="#4a5568" />
          </mesh>
        );
      });
    }
    return segments;
  }, [track]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[1200, 1200]} />
        <meshStandardMaterial color="#1f7a3f" />
      </mesh>
      {roadSegments}
      <Line points={track.points.map((p) => [p[0], 0.2, p[1]] as [number, number, number])} color="#f6e05e" closed linewidth={2} />
    </group>
  );
};

const RaceRuntime = ({ track, ghost, paused, onEsc, onRunComplete, speedCallback, timerCallback }: RaceSceneProps) => {
  const carRef = useRef<THREE.Group>(null);
  const keys = useRef<KeyState>({ w: false, a: false, s: false, d: false });
  const velocity = useRef(0);
  const heading = useRef(0);
  const timerStart = useRef<number | null>(null);
  const lastCheckpoint = useRef(new THREE.Vector3(track.points[0][0], 1, track.points[0][1]));
  const checkpointIndex = useRef(0);
  const ghostSamples = useRef<GhostData['samples']>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const { camera } = useThree();

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        onEsc();
        return;
      }
      if (e.key === 'Escape') {
        onEsc();
        return;
      }
      if (e.key.toLowerCase() === 'r') {
        resetCar();
      }
      if (e.key.toLowerCase() in keys.current) {
        keys.current[e.key.toLowerCase() as keyof KeyState] = true;
      }
    };

    const onUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() in keys.current) {
        keys.current[e.key.toLowerCase() as keyof KeyState] = false;
      }
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  });

  const resetCar = () => {
    const car = carRef.current;
    if (!car) return;
    car.position.copy(lastCheckpoint.current);
    velocity.current = 0;
  };


  useFrame((state, dt) => {
    const car = carRef.current;
    if (!car || paused) return;

    const accel = keys.current.w ? 22 : 0;
    const brake = keys.current.s ? 26 : 0;
    const drag = 8;

    velocity.current += accel * dt;
    velocity.current -= brake * dt;
    velocity.current -= Math.sign(velocity.current) * drag * dt;

    velocity.current = THREE.MathUtils.clamp(velocity.current, -12, 45);

    const steerInput = (keys.current.a ? 1 : 0) - (keys.current.d ? 1 : 0);
    heading.current += steerInput * dt * (1.4 + Math.abs(velocity.current) * 0.02);

    car.rotation.y = heading.current;
    const forward = new THREE.Vector3(Math.sin(heading.current), 0, Math.cos(heading.current));
    car.position.addScaledVector(forward, velocity.current * dt);

    const projected = projectToTrack(car.position.x, car.position.z, track.points);
    if (projected.dist > track.roadWidth / 2 + 1) {
      car.position.x = THREE.MathUtils.lerp(car.position.x, projected.point.x, 0.18);
      car.position.z = THREE.MathUtils.lerp(car.position.z, projected.point.y, 0.18);
      velocity.current *= 0.9;
    }

    if (car.position.y < -3 || Math.abs(velocity.current) < 0.4 && running && elapsedMs > 2500) {
      resetCar();
    }

    if (!running && car.position.distanceTo(lastCheckpoint.current) > 4) {
      timerStart.current = state.clock.elapsedTime * 1000;
      setRunning(true);
      ghostSamples.current = [];
    }

    if (running && timerStart.current !== null) {
      const now = state.clock.elapsedTime * 1000;
      const elapsed = now - timerStart.current;
      setElapsedMs(elapsed);
      timerCallback(elapsed, true);
      ghostSamples.current.push({
        t: elapsed,
        position: [car.position.x, car.position.y, car.position.z],
        rotationY: heading.current,
      });
    } else {
      timerCallback(0, false);
    }

    const cp = track.checkpoints[checkpointIndex.current];
    if (cp && withinCheckpoint(car.position.x, car.position.z, cp.x, cp.z, cp.radius)) {
      checkpointIndex.current += 1;
      lastCheckpoint.current.set(cp.x, 1, cp.z);
    }

    if (checkpointIndex.current >= track.checkpoints.length) {
      const finish = track.checkpoints[0];
      if (withinCheckpoint(car.position.x, car.position.z, finish.x, finish.z, finish.radius) && running) {
        const total = elapsedMs;
        setRunning(false);
        onRunComplete(total, { durationMs: total, samples: ghostSamples.current });
      }
    }

    speedCallback(Math.abs(velocity.current) * 8.6);

    const camOffset = new THREE.Vector3(0, 6, -12).applyAxisAngle(new THREE.Vector3(0, 1, 0), heading.current);
    const camTarget = car.position.clone().add(camOffset);
    camera.position.lerp(camTarget, 0.08);
    camera.lookAt(car.position.x, car.position.y + 1.2, car.position.z);
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight intensity={1.0} position={[40, 80, 20]} />
      <Environment preset="sunset" />
      <TrackMesh track={track} />
      {ghost && <GhostReplay ghost={ghost} elapsedMs={elapsedMs} active={running} />}
      <group ref={carRef} position={[track.points[track.startIndex][0], 1, track.points[track.startIndex][1]]}>
        <mesh>
          <boxGeometry args={[1.5, 0.7, 3]} />
          <meshStandardMaterial color="#e53e3e" />
        </mesh>
        <mesh position={[0, 0.45, -0.4]}>
          <boxGeometry args={[1.2, 0.5, 1.4]} />
          <meshStandardMaterial color="#fed7d7" />
        </mesh>
      </group>
    </>
  );
};

export const RaceScene = (props: RaceSceneProps) => (
  <Canvas camera={{ position: [0, 8, -16], fov: 60 }}>
    <RaceRuntime {...props} />
  </Canvas>
);
