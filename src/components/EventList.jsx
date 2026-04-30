import React from 'react';
import { formatDay, formatLocalTime, getEventBadge, isCountryEvent, VENUE_SIZES } from '../threatLogic.js';
import './EventList.css';

function getVenueSizeRank(event) {
  const venueName = event._embedded?.venues?.[0]?.name || '';
  if (VENUE_SIZES.LARGE.some(n => venueName.toLowerCase().includes(n.toLowerCase()))) return 0;
  if (VENUE_SIZES.MEDIUM.some(n => venueName.toLowerCase().includes(n.toLowerCase()))) return 1;
  return 2;
}

export default function EventList({ events, title = 'Events', hideHeader = false }) {
  if (!events || !events.length) return null;

  const sorted = [...events].sort((a, b) => {
    const sizeDiff = getVenueSizeRank(a) - getVenueSizeRank(b);
    if (sizeDiff !== 0) return sizeDiff;
    const dateA = a.dates?.start?.localDate || '';
    const dateB = b.dates?.start?.localDate || '';
    return dateA.localeCompare(dateB);
  });

  return (
    <section className="event-list">
      {!hideHeader && (
        <div className="event-list-header">
          <span className="event-list-title">{title.toUpperCase()}</span>
          <span className="event-list-count">{events.length} event{events.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="event-flat-list">
        {sorted.map(event => {
          const badge = getEventBadge(event);
          const cowboy = isCountryEvent(event);
          const venue = event._embedded?.venues?.[0]?.name || 'Unknown Venue';
          const time = event.dates?.start?.localTime
            ? formatLocalTime(event.dates.start.localDate, event.dates.start.localTime)
            : 'TBD';
          const day = formatDay(event.dates?.start?.localDate);

          return (
            <div key={event.id} className={`event-card threat-${badge.threat} ${cowboy ? 'event-cowboy' : ''}`}>
              <div className="event-badge">{badge.emoji}</div>
              <div className="event-info">
                <div className="event-name">
                  {cowboy && <span className="cowboy-warning">🤠 COWBOY ALERT /// </span>}
                  {event.name}
                </div>
                <div className="event-meta">
                  <span>{venue}</span>
                  <span className="meta-sep">·</span>
                  <span>{day}</span>
                  <span className="meta-sep">·</span>
                  <span>{time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
