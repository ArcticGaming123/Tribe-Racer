import { formatTime } from '../utils/format';

interface HUDProps {
  timeMs: number;
  speedKmh: number;
}

export const HUD = ({ timeMs, speedKmh }: HUDProps) => (
  <>
    <div className="hud-timer">{formatTime(timeMs)}</div>
    <div className="hud-speed">{`${Math.round(speedKmh)} km/h`}</div>
  </>
);
