import React, { useEffect, useState } from 'react';
import './ThreatGauge.css';

export default function ThreatGauge({ threat, todayEvents }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [threat?.id]);

  const isCowboy = threat?.id === 'COWBOY';

  return (
    <div className={`gauge-hero ${animate ? 'animate-in' : ''} level-${threat?.id?.toLowerCase()}`}>
      {isCowboy && <div className="cowboy-strobe" aria-hidden="true" />}

      <div className="gauge-inner">
        <div className="gauge-top-label">SEATTLE CENTER THREAT LEVEL</div>

        <div className={`gauge-emoji ${isCowboy ? 'cowboy-shake' : ''}`}>
          {isCowboy ? '🤠' : threat?.id === 'ABANDON' ? '🚨' : threat?.id === 'DANGER' ? '🔴' : threat?.id === 'RISKY' ? '🟠' : threat?.id === 'TOLERABLE' ? '🟡' : '🟢'}
        </div>

        <div className="gauge-status">{threat?.label?.replace(/^[^\s]+\s/, '')}</div>
        <div className="gauge-sublabel">{threat?.sublabel}</div>

        <p className="gauge-description">{threat?.description}</p>

        <div className="gauge-advice-box" style={{ borderColor: threat?.color }}>
          <span className="gauge-advice-prefix">RECOMMENDATION //</span>
          <span className="gauge-advice-text">{threat?.advice}</span>
        </div>

        {todayEvents.length > 0 && (
          <div className="gauge-today-events">
            <div className="gauge-section-label">ACTIVE EVENTS TODAY</div>
            {todayEvents.map(event => (
              <div key={event.id} className="gauge-event-pill">
                <span className="pill-name">{event.name}</span>
                <span className="pill-venue">{event._embedded?.venues?.[0]?.name}</span>
                <span className="pill-time">
                  {event.dates?.start?.localTime
                    ? formatTime(event.dates.start.localTime)
                    : 'TBD'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(t) {
  try {
    const [h, m] = t.split(':');
    const d = new Date();
    d.setHours(+h, +m);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch { return t; }
}
