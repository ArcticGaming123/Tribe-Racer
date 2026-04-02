export const formatTime = (timeMs: number) => {
  const totalSeconds = timeMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const secondsFixed = seconds.toFixed(3).padStart(minutes > 0 ? 6 : 0, '0');
  return minutes > 0 ? `${String(minutes).padStart(2, '0')}:${secondsFixed}` : secondsFixed;
};
