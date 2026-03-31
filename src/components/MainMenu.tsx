import { TrackSelect } from './TrackSelect';

interface MainMenuProps {
  onSelectTrack: (trackId: number) => void;
}

export const MainMenu = ({ onSelectTrack }: MainMenuProps) => (
  <div className="menu-shell">
    <h1>Tribe Racer</h1>
    <p className="subtitle">Arcade Time Trial · 10 escalating tracks</p>
    <TrackSelect onSelectTrack={onSelectTrack} />
  </div>
);
