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

const NEIGHBORHOOD_LABELS = {
  SEATTLE_CENTER: 'Seattle Center',
  DOWNTOWN:       'Downtown',
  SODO:           'SoDo',
  BALLARD:        'Ballard',
  UW:             'U District',
};

function formatDateLabel(selectedDate, neighborhood) {
  const today = new Date().toLocaleDateString('en-CA');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA');
  const place = NEIGHBORHOOD_LABELS[neighborhood] || 'Seattle Center';

  if (selectedDate === today) return `Tonight · ${place}`;
  if (selectedDate === tomorrowStr) return `Tomorrow · ${place}`;

  const d = new Date(selectedDate + 'T12:00:00');
  return `${d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · ${place}`;
}

export default function ThreatGauge({ threat, selectedDate, neighborhood }) {
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
          <span className="gauge-top-label">{formatDateLabel(selectedDate, neighborhood)}</span>
        </div>

        <div className={`gauge-emoji ${isCowboy ? 'cowboy-shake' : ''}`}>
          {STATUS_EMOJI[threat?.id] ?? '😌'}
        </div>

        <div className="gauge-status">{threat?.label}</div>
        <div className="gauge-sublabel">{threat?.sublabel}</div>

        <p className="gauge-description">{threat?.description}</p>
      </div>
    </div>
  );
}
