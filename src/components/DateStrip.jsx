import React from 'react';
import './DateStrip.css';

function getLabel(dateStr) {
  const today = new Date().toLocaleDateString('en-CA');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

  if (dateStr === today) return { top: 'Today', sub: null };
  if (dateStr === tomorrowStr) return { top: 'Tomorrow', sub: null };

  const d = new Date(dateStr + 'T12:00:00');
  return {
    top: d.toLocaleDateString('en-US', { weekday: 'short' }),
    sub: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  };
}

export default function DateStrip({ dates, selectedDate, onSelect, eventCounts }) {
  return (
    <div className="date-strip">
      {dates.map(date => {
        const { top, sub } = getLabel(date);
        const count = eventCounts[date] || 0;
        const isSelected = date === selectedDate;
        return (
          <button
            key={date}
            className={`date-pill ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(date)}
          >
            <span className="date-top">{top}</span>
            {sub && <span className="date-sub">{sub}</span>}
            {count > 0 && (
              <span className="date-count">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
