/**
 * Audio Level Waveform Visualizer for HRKVoice
 * Displays reactive animated audio bars reflecting microphone input level
 */

import React from 'react';

interface AudioVisualizerProps {
  level: number; // 0.0 to 1.0
  isRecording: boolean;
  barCount?: number;
  className?: string;
  color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  level,
  isRecording,
  barCount = 12,
  className = '',
  color = '#6366f1'
}) => {
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Generate organic wave variation based on bar index and current volume level
    const centerFactor = 1 - Math.abs(i - barCount / 2) / (barCount / 2);
    const noise = Math.sin((i * 1.5) + Date.now() / 200) * 0.15;
    const computedHeight = isRecording
      ? Math.max(12, Math.min(100, (level * 95 * centerFactor) + (noise * 20) + 15))
      : 8;

    return (
      <div
        key={i}
        className="w-1 rounded-full transition-all duration-75"
        style={{
          height: `${computedHeight}%`,
          backgroundColor: isRecording ? color : 'rgba(255, 255, 255, 0.2)',
          boxShadow: isRecording && level > 0.1 ? `0 0 8px ${color}88` : 'none'
        }}
      />
    );
  });

  return (
    <div className={`flex items-center justify-center gap-1 h-8 ${className}`}>
      {bars}
    </div>
  );
};
