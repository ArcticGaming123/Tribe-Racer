interface PauseMenuProps {
  onResume: () => void;
  onMenu: () => void;
  onTimes: () => void;
}

export const PauseMenu = ({ onResume, onMenu, onTimes }: PauseMenuProps) => (
  <div className="overlay">
    <div className="modal">
      <h2>Paused</h2>
      <button onClick={onResume}>Resume</button>
      <button onClick={onTimes}>View Times</button>
      <button onClick={onMenu}>Return to Main Menu</button>
    </div>
  </div>
);
