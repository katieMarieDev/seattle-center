import React, { useEffect, useState } from 'react';
import SpaceNeedle from './SpaceNeedle.jsx';
import './ThreatGauge.css';

const STATUS_EMOJI = {
  COWBOY:    '🤠',
  LEGENDARY: '🚨',
  ABANDON:   '🔴',
  PACKED:    '🔴',
  DANGER:    '🟠',
  RISKY:     '🟡',
  TOLERABLE: '🟢',
  SAFE:      '🟢',
};

function formatDateLabel(selectedDate) {
  const today = new Date().toLocaleDateString('en-CA');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

  if (selectedDate === today) return 'Tonight at Seattle Center';
  if (selectedDate === tomorrowStr) return 'Tomorrow at Seattle Center';

  const d = new Date(selectedDate + 'T12:00:00');
  return `${d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · Seattle Center`;
}

export default function ThreatGauge({ threat, selectedDate }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [threat?.id, selectedDate]);

  const isCowboy = threat?.id === 'COWBOY';

  return (
    <div className={`gauge-hero ${animate ? 'animate-in' : ''} level-${threat?.id?.toLowerCase()}`}>
      {isCowboy && <div className="cowboy-strobe" aria-hidden="true" />}

      <div className="gauge-inner">
        <div className="gauge-header">
          <SpaceNeedle size={22} color="var(--text-dim)" />
          <span className="gauge-top-label">{formatDateLabel(selectedDate)}</span>
        </div>

        <div className={`gauge-emoji ${isCowboy ? 'cowboy-shake' : ''}`}>
          {STATUS_EMOJI[threat?.id] ?? '😌'}
        </div>

        <div className="gauge-status">{threat?.label}</div>
        <div className="gauge-sublabel">{threat?.sublabel}</div>

        <p className="gauge-description">{threat?.description}</p>

        <div className="gauge-advice-box" style={{ borderColor: threat?.color }}>
          <span className="gauge-advice-prefix">Suggestion</span>
          <span className="gauge-advice-text">{threat?.advice}</span>
        </div>
      </div>
    </div>
  );
}
