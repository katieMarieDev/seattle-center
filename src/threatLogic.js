// Venue IDs for Seattle Center area venues
// Ticketmaster venue IDs - Climate Pledge Arena and nearby
export const SEATTLE_CENTER_VENUES = [
  'KovZpZA7AAEA', // Climate Pledge Arena (formerly KeyArena)
  'KovZpa3K7e',   // McCaw Hall
  'KovZpZA7dAeA', // Seattle Repertory Theatre
  'KovZpZA7lAeA', // MoPOP
  'KovZpZA7OAAA', // KEXP (nearby)
  'KovZpZA76leA', // Paramount Theatre (nearby, downtown)
  'KovZpZA7FAeA', // Moore Theatre
];

// Lat/lng radius search around Seattle Center
export const SEATTLE_CENTER_LAT = 47.6205;
export const SEATTLE_CENTER_LNG = -122.3493;
export const RADIUS_MILES = 0.5;

// Threat level definitions
export const THREAT_LEVELS = {
  COWBOY: {
    id: 'COWBOY',
    label: '🤠 COWBOY ALERT',
    sublabel: 'DEFCON 1',
    description: "Country music detected. The hats. The boots. The 'yeehaws'. This is not a drill.",
    advice: "Stay home. Hydrate. Put on some Phoebe Bridgers.",
    color: 'var(--cowboy)',
    dimColor: 'var(--cowboy-dim)',
    bgClass: 'bg-cowboy',
    score: 5,
  },
  ABANDON: {
    id: 'ABANDON',
    label: '🚨 ABANDON ALL HOPE',
    sublabel: 'MAXIMUM THREAT',
    description: "Multiple massive events happening simultaneously. The roads are a parking lot. The sidewalks are a moshpit.",
    advice: "Whatever you needed is available online.",
    color: 'var(--danger)',
    dimColor: 'var(--danger-dim)',
    bgClass: 'bg-danger',
    score: 4,
  },
  DANGER: {
    id: 'DANGER',
    label: '🔴 DO NOT LEAVE',
    sublabel: 'HIGH THREAT',
    description: "Major arena event in progress. Thousands of people, zero parking, one too many foam fingers.",
    advice: "If you must go: Uber, headphones, leave immediately after.",
    color: 'var(--danger)',
    dimColor: 'var(--danger-dim)',
    bgClass: 'bg-danger',
    score: 3,
  },
  RISKY: {
    id: 'RISKY',
    label: '🟠 PROCEED WITH CAUTION',
    sublabel: 'ELEVATED THREAT',
    description: "Something's going on over there. Moderate crowds, elevated noise levels.",
    advice: "You can do it. Bring headphones. Have an exit strategy.",
    color: 'var(--risky)',
    dimColor: 'var(--risky-dim)',
    bgClass: 'bg-risky',
    score: 2,
  },
  TOLERABLE: {
    id: 'TOLERABLE',
    label: '🟡 MANAGEABLE',
    sublabel: 'LOW THREAT',
    description: "Small or quiet event nearby. Theater crowd: well-behaved, likely to whisper.",
    advice: "Probably fine. Dress layers.",
    color: 'var(--tolerable)',
    dimColor: 'var(--tolerable-dim)',
    bgClass: 'bg-tolerable',
    score: 1,
  },
  SAFE: {
    id: 'SAFE',
    label: '🟢 YOU MAY PROCEED',
    sublabel: 'ALL CLEAR',
    description: "No major events detected. The Seattle Center is a peaceful place right now.",
    advice: "Go outside. Touch grass. You've earned it.",
    color: 'var(--safe)',
    dimColor: 'var(--safe-dim)',
    bgClass: 'bg-safe',
    score: 0,
  },
};

// Genre/subgenre detection
const COUNTRY_GENRES = ['country', 'country & folk', 'bluegrass'];
const COUNTRY_SUBGENRES = ['country', 'contemporary country', 'alt country', 'americana', 'country pop', 'country rock', 'bluegrass'];

const LARGE_VENUE_SEGMENTS = ['sports'];
const ARENA_KEYWORDS = ['kraken', 'storm', 'seattle storm', 'nhl', 'nba', 'wnba'];

function getEventGenreInfo(event) {
  const classifications = event.classifications || [];
  const segment = classifications[0]?.segment?.name?.toLowerCase() || '';
  const genre = classifications[0]?.genre?.name?.toLowerCase() || '';
  const subGenre = classifications[0]?.subGenre?.name?.toLowerCase() || '';
  return { segment, genre, subGenre };
}

export function isCountryEvent(event) {
  const { genre, subGenre } = getEventGenreInfo(event);
  return (
    COUNTRY_GENRES.some(g => genre.includes(g)) ||
    COUNTRY_SUBGENRES.some(g => subGenre.includes(g))
  );
}

export function isArenaEvent(event) {
  const { segment } = getEventGenreInfo(event);
  const name = event.name?.toLowerCase() || '';
  return (
    segment === 'sports' ||
    ARENA_KEYWORDS.some(k => name.includes(k))
  );
}

export function isArtsEvent(event) {
  const { segment } = getEventGenreInfo(event);
  return segment === 'arts & theatre' || segment === 'theatre';
}

export function scoreSingleEvent(event) {
  if (isCountryEvent(event)) return 50; // country is always maximum pain
  if (isArenaEvent(event)) return 10;
  const { segment } = getEventGenreInfo(event);
  if (segment === 'music') return 7;
  if (isArtsEvent(event)) return 2;
  return 3;
}

export function calculateThreatLevel(events) {
  if (!events || events.length === 0) return THREAT_LEVELS.SAFE;

  const hasCountry = events.some(isCountryEvent);
  if (hasCountry) return THREAT_LEVELS.COWBOY;

  const totalScore = events.reduce((sum, e) => sum + scoreSingleEvent(e), 0);

  if (totalScore >= 20) return THREAT_LEVELS.ABANDON;
  if (totalScore >= 10) return THREAT_LEVELS.DANGER;
  if (totalScore >= 5)  return THREAT_LEVELS.RISKY;
  if (totalScore >= 2)  return THREAT_LEVELS.TOLERABLE;
  return THREAT_LEVELS.SAFE;
}

export function getEventBadge(event) {
  if (isCountryEvent(event)) return { emoji: '🤠', label: 'Country', threat: 'cowboy' };
  if (isArenaEvent(event))   return { emoji: '🏟️', label: 'Arena',   threat: 'danger' };
  const { segment } = getEventGenreInfo(event);
  if (segment === 'music')   return { emoji: '🎵', label: 'Concert', threat: 'risky' };
  if (isArtsEvent(event))    return { emoji: '🎭', label: 'Arts',    threat: 'tolerable' };
  return { emoji: '📅', label: 'Event', threat: 'low' };
}

export function formatLocalTime(dateStr, timeStr) {
  if (!dateStr) return '';
  try {
    const dt = new Date(`${dateStr}T${timeStr || '00:00:00'}`);
    return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return timeStr || '';
  }
}

export function formatDay(dateStr) {
  if (!dateStr) return '';
  try {
    const dt = new Date(dateStr + 'T12:00:00');
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (dt.toDateString() === today.toDateString()) return 'Today';
    if (dt.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function groupEventsByDay(events) {
  const groups = {};
  for (const event of events) {
    const date = event.dates?.start?.localDate;
    if (!date) continue;
    if (!groups[date]) groups[date] = [];
    groups[date].push(event);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}
