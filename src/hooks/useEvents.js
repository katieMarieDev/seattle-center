import { useState, useEffect } from 'react';
import { SEATTLE_CENTER_LAT, SEATTLE_CENTER_LNG, RADIUS_MILES } from '../threatLogic.js';

const API_KEY = import.meta.env.VITE_TICKETMASTER_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    if (!API_KEY) {
      setError('NO_KEY');
      setLoading(false);
      return;
    }
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const sevenDays = new Date(now);
      sevenDays.setDate(now.getDate() + 7);

      const params = new URLSearchParams({
        apikey: API_KEY,
        latlong: `${SEATTLE_CENTER_LAT},${SEATTLE_CENTER_LNG}`,
        radius: RADIUS_MILES,
        unit: 'miles',
        startDateTime: now.toISOString().replace(/\.\d{3}Z$/, 'Z'),
        endDateTime: sevenDays.toISOString().replace(/\.\d{3}Z$/, 'Z'),
        size: 50,
        sort: 'date,asc',
        classificationName: 'music,sports,arts',
      });

      const res = await fetch(`${BASE_URL}?${params}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      const allEvents = data?._embedded?.events || [];

      // Filter to today for hero section
      const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
      const todays = allEvents.filter(e => e.dates?.start?.localDate === todayStr);

      setEvents(allEvents);
      setTodayEvents(todays);
      setUpdatedAt(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { events, todayEvents, loading, error, updatedAt, refetch: fetchEvents };
}
