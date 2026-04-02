import { useState } from 'react';
import { formatTime } from '../utils/format';

interface ResultsModalProps {
  timeMs: number;
  qualifies: boolean;
  onSubmit: (name: string | null) => void;
  onRetry: () => void;
  onMenu: () => void;
  onTimes: () => void;
}

export const ResultsModal = ({ timeMs, qualifies, onSubmit, onRetry, onMenu, onTimes }: ResultsModalProps) => {
  const [name, setName] = useState('Player');

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Finish!</h2>
        <p>{`Final Time: ${formatTime(timeMs)}`}</p>
        {qualifies && (
          <div className="input-wrap">
            <label>Top 10! Enter Name:</label>
            <input value={name} maxLength={16} onChange={(e) => setName(e.target.value)} />
            <button onClick={() => onSubmit(name.trim() || 'Player')}>Save Time</button>
          </div>
        )}
        {!qualifies && <button onClick={() => onSubmit(null)}>Continue</button>}
        <button onClick={onRetry}>Retry Track</button>
        <button onClick={onTimes}>View Times</button>
        <button onClick={onMenu}>Return to Menu</button>
      </div>
    </div>
  );
};
