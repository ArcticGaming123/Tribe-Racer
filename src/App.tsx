import { useMemo, useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { RaceScene } from './components/RaceScene';
import { HUD } from './components/HUD';
import { PauseMenu } from './components/PauseMenu';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ResultsModal } from './components/ResultsModal';
import { getTrackById } from './tracks/tracks';
import { getBestTime, getGhost, getLeaderboard, qualifiesTop10, saveLeaderboardRun, setBestTime, setGhost } from './utils/storage';
import type { GhostData } from './types';

export const App = () => {
  const [trackId, setTrackId] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [showTimes, setShowTimes] = useState(false);
  const [resultTime, setResultTime] = useState<number | null>(null);
  const [latestGhost, setLatestGhost] = useState<GhostData | null>(null);
  const [speed, setSpeed] = useState(0);
  const [timer, setTimer] = useState(0);
  const [resetTick, setResetTick] = useState(0);

  const track = trackId ? getTrackById(trackId) : null;
  const leaderboard = useMemo(() => (trackId ? getLeaderboard(trackId) : []), [trackId, showTimes, resultTime]);
  const ghost = useMemo(() => (trackId ? getGhost(trackId) : null), [trackId, resultTime, resetTick]);

  if (!track) {
    return <MainMenu onSelectTrack={(id) => setTrackId(id)} />;
  }

  const restart = () => {
    setResultTime(null);
    setPaused(false);
    setShowTimes(false);
    setResetTick((v) => v + 1);
  };

  return (
    <div className="race-root" key={`${track.id}-${resetTick}`}>
      <RaceScene
        track={track}
        ghost={ghost}
        paused={paused || resultTime !== null || showTimes}
        onEsc={() => {
          if (resultTime !== null) return;
          setShowTimes(false);
          setPaused((p) => !p);
        }}
        speedCallback={(s) => setSpeed(s)}
        timerCallback={(elapsed, running) => setTimer(running ? elapsed : 0)}
        onRunComplete={(timeMs, ghostData) => {
          setResultTime(timeMs);
          setLatestGhost(ghostData);
        }}
      />

      <HUD timeMs={resultTime ?? timer} speedKmh={speed} />

      <div className="hint-bar">WASD drive · R reset to checkpoint · TAB pause</div>

      {paused && !showTimes && resultTime === null && (
        <PauseMenu onResume={() => setPaused(false)} onMenu={() => setTrackId(null)} onTimes={() => setShowTimes(true)} />
      )}

      {showTimes && (
        <LeaderboardModal title={`Track ${track.id} Times`} entries={leaderboard} onClose={() => setShowTimes(false)} />
      )}

      {resultTime !== null && (
        <ResultsModal
          timeMs={resultTime}
          qualifies={qualifiesTop10(track.id, resultTime)}
          onSubmit={(name) => {
            if (name) {
              saveLeaderboardRun(track.id, { name, timeMs: resultTime, createdAt: Date.now() });
            }
            const currentBest = getBestTime(track.id);
            if (currentBest === null || resultTime < currentBest) {
              setBestTime(track.id, resultTime);
              if (latestGhost) setGhost(track.id, latestGhost);
            }
          }}
          onRetry={restart}
          onMenu={() => {
            setResultTime(null);
            setTrackId(null);
          }}
          onTimes={() => setShowTimes(true)}
        />
      )}
    </div>
  );
};
