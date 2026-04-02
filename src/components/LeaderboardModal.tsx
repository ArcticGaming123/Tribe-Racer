import type { LeaderboardEntry } from '../types';
import { formatTime } from '../utils/format';

interface LeaderboardModalProps {
  title: string;
  entries: LeaderboardEntry[];
  onClose: () => void;
}

export const LeaderboardModal = ({ title, entries, onClose }: LeaderboardModalProps) => (
  <div className="overlay">
    <div className="modal wide">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Place</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={`${entry.createdAt}-${entry.name}`}>
              <td>{i + 1}</td>
              <td>{entry.name}</td>
              <td>{formatTime(entry.timeMs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {entries.length === 0 && <p>No times yet.</p>}
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);
