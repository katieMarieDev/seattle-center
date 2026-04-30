import React, { useState, useRef } from 'react';
import { useEvents } from './hooks/useEvents.js';
import { useEventbriteEvents } from './hooks/useEventbriteEvents.js';
import { calculateThreatLevel, getVenueCategory } from './threatLogic.js';
import ThreatGauge from './components/ThreatGauge.jsx';
import EventList from './components/EventList.jsx';
import DateStrip from './components/DateStrip.jsx';
import './App.css';

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('en-CA');
  });
}

export default function App() {
  const { events: tmEvents, loading, error, updatedAt, refetch } = useEvents();
  const ebEvents = useEventbriteEvents();
  const events = [...tmEvents, ...ebEvents];
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-CA')
  );
  const touchStartX = useRef(null);
  const dates = getNext7Days();

  const eventCounts = Object.fromEntries(
    dates.map(d => [d, events.filter(e => e.dates?.start?.localDate === d).length])
  );

  const selectedEvents = events.filter(e => e.dates?.start?.localDate === selectedDate);
  const seattleCenterEvents = selectedEvents.filter(e => getVenueCategory(e) === 'SEATTLE_CENTER');
  const nearbyEvents = selectedEvents.filter(e => getVenueCategory(e) !== 'SEATTLE_CENTER');
  const threat = calculateThreatLevel(seattleCenterEvents);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const idx = dates.indexOf(selectedDate);
      if (diff > 0 && idx < dates.length - 1) setSelectedDate(dates[idx + 1]);
      if (diff < 0 && idx > 0) setSelectedDate(dates[idx - 1]);
    }
    touchStartX.current = null;
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-dot-row">
          <span /><span /><span />
        </div>
        <p>SCANNING SEATTLE CENTER...</p>
      </div>
    );
  }

  if (error === 'NO_KEY') {
    return (
      <div className="error-screen">
        <div className="error-emoji">🔑</div>
        <h1>API KEY REQUIRED</h1>
        <p>Create a <code>.env</code> file in the project root:</p>
        <pre>VITE_TICKETMASTER_KEY=your_key_here</pre>
        <p className="error-sub">Get a free key at <a href="https://developer.ticketmaster.com" target="_blank" rel="noopener noreferrer">developer.ticketmaster.com</a></p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-emoji">⚠️</div>
        <h1>SOMETHING WENT WRONG</h1>
        <p className="error-sub">{error}</p>
        <button className="retry-btn" onClick={refetch}>TRY AGAIN</button>
      </div>
    );
  }

  return (
    <div className="app" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <DateStrip
        dates={dates}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        eventCounts={eventCounts}
      />
      <ThreatGauge threat={threat} selectedDate={selectedDate} />
      <EventList events={seattleCenterEvents} title="At Seattle Center" />
      {nearbyEvents.length > 0 && (
        <details className="nearby-section">
          <summary className="nearby-summary">
            Also nearby
            <span className="nearby-count">{nearbyEvents.length} event{nearbyEvents.length !== 1 ? 's' : ''}</span>
          </summary>
          <EventList events={nearbyEvents} hideHeader />
        </details>
      )}
      <footer className="app-footer">
        <span>Data via Ticketmaster</span>
        {updatedAt && (
          <span>Updated {updatedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
        )}
        <button className="refresh-btn" onClick={refetch}>↺ Refresh</button>
      </footer>
    </div>
  );
}
