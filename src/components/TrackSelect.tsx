import { TRACKS } from '../tracks/tracks';
import { formatTime } from '../utils/format';
import { getBestTime } from '../utils/storage';

interface TrackSelectProps {
  onSelectTrack: (trackId: number) => void;
}

export const TrackSelect = ({ onSelectTrack }: TrackSelectProps) => (
  <div className="track-grid">
    {TRACKS.map((track) => {
      const best = getBestTime(track.id);
      return (
        <button key={track.id} className="track-card" onClick={() => onSelectTrack(track.id)}>
          <strong>{`Track ${track.id}: ${track.name}`}</strong>
          <span>{track.difficulty}</span>
          <small>{best ? `Best: ${formatTime(best)}` : 'Best: ---'}</small>
        </button>
      );
    })}
  </div>
);
