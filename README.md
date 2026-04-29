# Seattle Center Introvert Gauge 🏔️

> Should you leave the house? Probably not. But let's check.

A mobile-first web app that tells you the current introvert threat level at Seattle Center,
with special 🤠 COWBOY ALERT for country music events.

## Setup

### 1. Get a Ticketmaster API Key (free)
Go to [developer.ticketmaster.com](https://developer.ticketmaster.com), sign up, and grab your API key.

### 2. Configure your key
```bash
cp .env.example .env
# Edit .env and add your key:
# VITE_TICKETMASTER_KEY=your_key_here
```

### 3. Run locally
```bash
npm install
npm run dev
```

## Deploy to Netlify

### Option A: Drag & drop
1. Run `npm run build`
2. Drag the `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop)
3. Set environment variable `VITE_TICKETMASTER_KEY` in Site Settings → Environment Variables
4. Trigger a redeploy

### Option B: Connect to GitHub (auto-deploys)
1. Push this repo to GitHub
2. In Netlify: New Site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add env var: `VITE_TICKETMASTER_KEY`

## Customizing Threat Levels

Edit `src/threatLogic.js`:
- `THREAT_LEVELS` — change labels, descriptions, advice text
- `isCountryEvent()` — tweak what counts as a cowboy alert
- `scoreSingleEvent()` — adjust threat scoring per event type

## Customizing Venues

The app searches by lat/lng radius (0.5 miles from Seattle Center).
Edit `SEATTLE_CENTER_LAT`, `SEATTLE_CENTER_LNG`, and `RADIUS_MILES` in `threatLogic.js` to move the search area.
