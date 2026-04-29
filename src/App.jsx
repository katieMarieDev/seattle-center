import React from 'react';
import { useEvents } from './hooks/useEvents.js';
import { calculateThreatLevel } from './threatLogic.js';
import ThreatGauge from './components/ThreatGauge.jsx';
import EventList from './components/EventList.jsx';
import './App.css';

export default function App() {
  const { events, todayEvents, loading, error, updatedAt, refetch } = useEvents();
  const threat = calculateThreatLevel(todayEvents.length > 0 ? todayEvents : events.slice(0, 3));

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
    <div className="app">
      <ThreatGauge threat={threat} todayEvents={todayEvents} />
      <EventList events={events} />
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
