import React from 'react';
import './NeighborhoodPicker.css';

export const NEIGHBORHOODS = [
  { id: 'SEATTLE_CENTER', label: 'Seattle Center' },
  { id: 'DOWNTOWN',       label: 'Downtown' },
  { id: 'SODO',           label: 'SoDo' },
  { id: 'BALLARD',        label: 'Ballard' },
  { id: 'UW',             label: 'U District' },
];

export default function NeighborhoodPicker({ selected, onSelect, eventCounts }) {
  return (
    <div className="neighborhood-picker">
      {NEIGHBORHOODS.map(({ id, label }) => {
        const count = eventCounts[id] || 0;
        return (
          <button
            key={id}
            className={`neighborhood-pill ${selected === id ? 'selected' : ''}`}
            onClick={() => onSelect(id)}
          >
            {label}
            {count > 0 && <span className="neighborhood-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
