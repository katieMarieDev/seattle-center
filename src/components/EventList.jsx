import React, { useState } from 'react';
import { groupEventsByDay, formatDay, formatLocalTime, getEventBadge, isCountryEvent } from '../threatLogic.js';
import './EventList.css';

export default function EventList({ events }) {
  const grouped = groupEventsByDay(events);
  const [expanded, setExpanded] = useState(null);

  if (!events.length) return null;

  return (
    <section className="event-list">
      <div className="event-list-header">
        <span className="event-list-title">NEXT 7 DAYS</span>
        <span className="event-list-count">{events.length} event{events.length !== 1 ? 's' : ''}</span>
      </div>

      {grouped.map(([date, dayEvents]) => {
        const isOpen = expanded === date;
        const hasCountry = dayEvents.some(isCountryEvent);

        return (
          <div key={date} className={`day-group ${hasCountry ? 'has-cowboy' : ''}`}>
            <button
              className="day-header"
              onClick={() => setExpanded(isOpen ? null : date)}
              aria-expanded={isOpen}
            >
              <span className="day-label">
                {hasCountry && <span className="cowboy-flag" title="Country alert">🤠</span>}
                {formatDay(date)}
              </span>
              <span className="day-count">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</span>
              <span className="day-chevron">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="day-events">
                {dayEvents.map(event => {
                  const badge = getEventBadge(event);
                  const cowboy = isCountryEvent(event);
                  const venue = event._embedded?.venues?.[0]?.name || 'Unknown Venue';
                  const time = event.dates?.start?.localTime
                    ? formatLocalTime(event.dates.start.localDate, event.dates.start.localTime)
                    : 'TBD';

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
                          <span>{time}</span>
                        </div>
                        <div className="event-genre-tag">{badge.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
