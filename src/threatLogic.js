export const VENUE_CATEGORIES = {
  SEATTLE_CENTER: [
    'Climate Pledge Arena',
    'McCaw Hall',
    'Seattle Repertory Theatre',
    'MoPOP',
    'KEXP',
    'KeyArena',
    'Bagley Wright',
    'Intiman',
    'Seattle Center Armory',
    'Seattle Center Fisher Pavilion',
  ],
  DOWNTOWN: [
    'Paramount Theatre',
    'Moore Theatre',
    '5th Avenue Theatre',
    'The Triple Door',
    'Triple Door',
    'The Showbox',
    'Showbox',
    'Benaroya Hall',
    'The Crocodile',
    'Crocodile',
    'Neumos',
    'Dimitriou',
  ],
  SODO: [
    'Lumen Field',
    'T-Mobile Park',
    'WaMu Theater',
    'WAMU Theater',
    'Showbox SoDo',
    'Showbox SODO',
  ],
  UW: [
    'Husky Stadium',
    'Alaska Airlines Arena',
    'Meany Hall',
    'HEC Edmundson',
  ],
  BALLARD: [
    'Tractor Tavern',
    'Sunset Tavern',
    'Ballard',
  ],
};

export const VENUE_SIZES = {
  LARGE: [
    'Climate Pledge Arena', 'KeyArena',
    'Lumen Field',
    'T-Mobile Park',
    'Husky Stadium',
  ],
  MEDIUM: [
    'McCaw Hall',
    'Paramount Theatre',
    'Moore Theatre',
    '5th Avenue Theatre',
    'Benaroya Hall',
    'Showbox SoDo', 'Showbox SODO',
    'WaMu Theater', 'WAMU Theater',
    'Alaska Airlines Arena',
    'HEC Edmundson',
  ],
};

const LOW_IMPACT_KEYWORDS = [
  'ballpark tour', 'stadium tour', 'arena tour', 'behind the scenes',
  'facility tour', 'building tour', 'guided tour',
  'clinic', 'meet & greet', 'autograph', 'youth', 'education',
  'fundraiser', 'gala', 'open rehearsal', 'talk', 'lecture',
];

const MEGA_EVENT_KEYWORDS = [
  'fifa', 'world cup', 'super bowl', 'championship', 'playoff',
  'nfl playoff', 'nba playoff', 'stanley cup', 'world series',
  'mls cup', 'gold cup',
];

function getVenueSize(event) {
  const venueName = event._embedded?.venues?.[0]?.name || '';
  if (VENUE_SIZES.LARGE.some(n => venueName.toLowerCase().includes(n.toLowerCase()))) return 'LARGE';
  if (VENUE_SIZES.MEDIUM.some(n => venueName.toLowerCase().includes(n.toLowerCase()))) return 'MEDIUM';
  return 'SMALL';
}

function isLowImpactEvent(event) {
  const name = event.name?.toLowerCase() || '';
  return LOW_IMPACT_KEYWORDS.some(k => name.includes(k));
}

function isMegaEvent(event) {
  const name = event.name?.toLowerCase() || '';
  return MEGA_EVENT_KEYWORDS.some(k => name.includes(k));
}

export function getVenueCategory(event) {
  const venueName = event._embedded?.venues?.[0]?.name || '';
  for (const [category, names] of Object.entries(VENUE_CATEGORIES)) {
    if (names.some(n => venueName.toLowerCase().includes(n.toLowerCase()))) {
      return category;
    }
  }
  return 'OTHER';
}

// Lat/lng radius search around Seattle Center
export const SEATTLE_CENTER_LAT = 47.6205;
export const SEATTLE_CENTER_LNG = -122.3493;
export const RADIUS_MILES = 5;

// Threat level definitions
export const THREAT_LEVELS = {
  COWBOY: {
    id: 'COWBOY',
    label: 'Cowboy alert',
    sublabel: 'Country music detected',
    description: "Someone booked a country act. The hats are coming. The boots are coming.",
    advice: "Maybe stay in and put on some Phoebe Bridgers.",
    color: 'var(--cowboy)',
    dimColor: 'var(--cowboy-dim)',
    bgClass: 'bg-cowboy',
    score: 5,
  },
  LEGENDARY: {
    id: 'LEGENDARY',
    label: 'Historic event',
    sublabel: 'Once-in-a-city moment',
    description: "Something massive is happening — the kind of event Seattle will be talking about for years. The whole city will feel it.",
    advice: "Plan way ahead, take transit, and expect the unexpected.",
    color: 'var(--legendary)',
    dimColor: 'var(--legendary-dim)',
    bgClass: 'bg-legendary',
    score: 6,
  },
  ABANDON: {
    id: 'ABANDON',
    label: "Really busy out there",
    sublabel: 'Multiple big events',
    description: "Several massive events are happening at once. Traffic and parking will be rough throughout the whole area.",
    advice: "If you can, pick another night — or take the Link.",
    color: 'var(--danger)',
    dimColor: 'var(--danger-dim)',
    bgClass: 'bg-danger',
    score: 5,
  },
  PACKED: {
    id: 'PACKED',
    label: 'Busy tonight',
    sublabel: 'Major event nearby',
    description: "There's a big event at a large venue tonight. Parking will be tough and nearby restaurants will be slammed.",
    advice: "Go early or grab transit. Give yourself extra time.",
    color: 'var(--danger)',
    dimColor: 'var(--danger-dim)',
    bgClass: 'bg-danger',
    score: 4,
  },
  DANGER: {
    id: 'DANGER',
    label: 'A bit busy',
    sublabel: 'Some activity nearby',
    description: "There's something going on at Seattle Center tonight. Parking near the venue might be tight.",
    advice: "You've got this. Maybe leave a few minutes early.",
    color: 'var(--risky)',
    dimColor: 'var(--risky-dim)',
    bgClass: 'bg-risky',
    score: 3,
  },
  RISKY: {
    id: 'RISKY',
    label: 'A little busy',
    sublabel: 'Some activity nearby',
    description: "There's something going on, but it's manageable. Parking might be tight near the venue.",
    advice: "You've got this. Maybe leave a few minutes early.",
    color: 'var(--risky)',
    dimColor: 'var(--risky-dim)',
    bgClass: 'bg-risky',
    score: 2,
  },
  TOLERABLE: {
    id: 'TOLERABLE',
    label: 'Pretty quiet',
    sublabel: 'Small events only',
    description: "Just a small show or two nearby. Parking should be fine and restaurants won't be slammed.",
    advice: "Good night to head out.",
    color: 'var(--tolerable)',
    dimColor: 'var(--tolerable-dim)',
    bgClass: 'bg-tolerable',
    score: 1,
  },
  SAFE: {
    id: 'SAFE',
    label: 'All clear',
    sublabel: 'Nothing going on',
    description: "Seattle Center is quiet. Parking is easy and your favorite restaurant has tables.",
    advice: "Great night to head out.",
    color: 'var(--safe)',
    dimColor: 'var(--safe-dim)',
    bgClass: 'bg-safe',
    score: 0,
  },
};

// Genre/subgenre detection
const COUNTRY_GENRES = ['country', 'country & folk', 'bluegrass'];
const COUNTRY_SUBGENRES = ['country', 'contemporary country', 'alt country', 'americana', 'country pop', 'country rock', 'bluegrass'];
const COUNTRY_NAME_KEYWORDS = ['cowgirl', 'cowboy', 'honky tonk', 'hoedown', 'country tour', 'country music'];

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
  const name = event.name?.toLowerCase() || '';
  return (
    COUNTRY_GENRES.some(g => genre.includes(g)) ||
    COUNTRY_SUBGENRES.some(g => subGenre.includes(g)) ||
    COUNTRY_NAME_KEYWORDS.some(k => name.includes(k))
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
  if (isCountryEvent(event) && !isLowImpactEvent(event)) return 50;
  if (isMegaEvent(event)) return 40;

  const size = getVenueSize(event);
  const lowImpact = isLowImpactEvent(event);

  if (lowImpact) return size === 'LARGE' ? 2 : 1;

  if (size === 'LARGE') return isArenaEvent(event) ? 15 : 12;
  if (size === 'MEDIUM') return isArenaEvent(event) ? 7 : 5;

  const { segment } = getEventGenreInfo(event);
  if (segment === 'music') return 3;
  if (isArtsEvent(event)) return 1;
  return 2;
}

export function calculateThreatLevel(events) {
  if (!events || events.length === 0) return THREAT_LEVELS.SAFE;

  const hasCountry = events.some(isCountryEvent);
  if (hasCountry) return THREAT_LEVELS.COWBOY;

  const hasMega = events.some(isMegaEvent);
  if (hasMega) return THREAT_LEVELS.LEGENDARY;

  const totalScore = events.reduce((sum, e) => sum + scoreSingleEvent(e), 0);

  if (totalScore >= 25) return THREAT_LEVELS.ABANDON;
  if (totalScore >= 15) return THREAT_LEVELS.PACKED;
  if (totalScore >= 7)  return THREAT_LEVELS.DANGER;
  if (totalScore >= 4)  return THREAT_LEVELS.RISKY;
  if (totalScore >= 2)  return THREAT_LEVELS.TOLERABLE;
  return THREAT_LEVELS.SAFE;
}

function getSportEmoji(event) {
  const name = event.name?.toLowerCase() || '';
  const { genre, subGenre } = getEventGenreInfo(event);
  const all = `${name} ${genre} ${subGenre}`;
  if (all.includes('hockey') || name.includes('kraken')) return '🏒';
  if (all.includes('basketball') || name.includes('storm') || name.includes('sonics')) return '🏀';
  if (all.includes('baseball') || name.includes('mariners')) return '⚾';
  if (all.includes('nfl') || all.includes('american football') || name.includes('seahawks')) return '🏈';
  if (all.includes('soccer') || all.includes('mls') || name.includes('sounders')) return '⚽';
  if (all.includes('tennis')) return '🎾';
  if (all.includes('wrestling') || name.includes('wwe') || name.includes('aew')) return '🤼';
  if (all.includes('boxing') || all.includes('mma') || all.includes('ufc')) return '🥊';
  return '🏟️';
}

const ARTS_VENUES = ['Bagley Wright', 'Intiman', 'Seattle Repertory'];
const MUSIC_VENUES = ['KEXP'];

function getArtsEmoji(event) {
  const name = event.name?.toLowerCase() || '';
  const { genre, subGenre } = getEventGenreInfo(event);
  const all = `${name} ${genre} ${subGenre}`;
  if (all.includes('comedy') || all.includes('stand-up') || all.includes('standup')) return '🎤';
  if (all.includes('ballet') || all.includes('dance')) return '🩰';
  if (all.includes('opera')) return '🎼';
  if (all.includes('circus') || all.includes('magic')) return '🎪';
  return '🎭';
}

export function getEventBadge(event) {
  const venueName = event._embedded?.venues?.[0]?.name || '';

  if (ARTS_VENUES.some(v => venueName.includes(v))) {
    return { emoji: '🎭', label: 'Arts', threat: 'tolerable' };
  }
  if (MUSIC_VENUES.some(v => venueName.includes(v))) {
    return { emoji: '🎵', label: 'Concert', threat: 'risky' };
  }

  if (isCountryEvent(event)) return { emoji: '🤠', label: 'Country', threat: 'cowboy' };
  const { segment } = getEventGenreInfo(event);
  if (segment === 'sports' || isArenaEvent(event)) {
    return { emoji: getSportEmoji(event), label: 'Sports', threat: 'danger' };
  }
  if (segment === 'music') return { emoji: '🎵', label: 'Concert', threat: 'risky' };
  if (isArtsEvent(event))  return { emoji: getArtsEmoji(event), label: 'Arts', threat: 'tolerable' };
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
