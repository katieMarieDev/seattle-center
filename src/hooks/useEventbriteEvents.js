import { useState, useEffect } from 'react';
import { SEATTLE_CENTER_LAT, SEATTLE_CENTER_LNG } from '../threatLogic.js';

const API_KEY = import.meta.env.VITE_EVENTBRITE_KEY;

function normalizeEvent(eb) {
  const venue = eb.venue;
  const startLocal = eb.start?.local || '';
  const [localDate, localTime] = startLocal.split('T');

  return {
    id: `eb-${eb.id}`,
    name: eb.name?.text || 'Untitled Event',
    source: 'eventbrite',
    url: eb.url,
    dates: {
      start: {
        localDate: localDate || '',
        localTime: localTime || '',
      },
    },
    _embedded: {
      venues: [{
        name: venue?.name || 'Unknown Venue',
        address: venue?.address,
      }],
    },
    classifications: [{
      segment: { name: mapCategory(eb.category_id) },
      genre: { name: '' },
      subGenre: { name: '' },
    }],
    _free: eb.is_free,
  };
}

// Eventbrite category IDs → our segment names
function mapCategory(categoryId) {
  const map = {
    '103': 'music',
    '108': 'sports',
    '105': 'arts & theatre',
    '104': 'arts & theatre',
    '110': 'arts & theatre',
    '113': 'arts & theatre',
  };
  return map[String(categoryId)] || 'other';
}

export function useEventbriteEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!API_KEY) return;
    fetchEventbriteEvents();
  }, []);

  async function fetchEventbriteEvents() {
    try {
      const now = new Date();
      const sevenDays = new Date(now);
      sevenDays.setDate(now.getDate() + 7);

      const params = new URLSearchParams({
        'location.latitude': SEATTLE_CENTER_LAT,
        'location.longitude': SEATTLE_CENTER_LNG,
        'location.within': '5mi',
        'start_date.range_start': now.toISOString().split('.')[0] + 'Z',
        'start_date.range_end': sevenDays.toISOString().split('.')[0] + 'Z',
        'expand': 'venue',
        'page_size': 50,
        'token': API_KEY,
      });

      const res = await fetch(`/eventbrite/events/search/?${params}`);
      if (!res.ok) return;
      const data = await res.json();

      const normalized = (data.events || []).map(normalizeEvent);
      setEvents(normalized);
    } catch (err) {
      console.error('Eventbrite fetch failed:', err);
    }
  }

  return events;
}
