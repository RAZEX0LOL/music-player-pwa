# Offline Music Player PWA

A Progressive Web App that lets you listen to your music completely offline, without any internet connection!

## Features

- **100% Offline** - Works without internet after initial setup
- **Install as App** - Can be installed on your phone/desktop
- **Beautiful UI** - Modern, animated interface with vinyl disc animation
- **Full Controls** - Play, pause, next, previous, seek, volume
- **Lock Screen Controls** - Control music from your phone's lock screen
- **Playlist Management** - Add, delete, and manage your songs
- **No Server Needed** - All music stored locally in your browser

## How to Use

### 1. Setup (requires internet once)

You need a local web server to run the PWA. Here are three easy ways:

**Option A: Using Python (if installed)**
```bash
cd music-player-pwa
python3 -m http.server 8000
```

**Option B: Using Node.js (if installed)**
```bash
cd music-player-pwa
npx serve
```

**Option C: Using PHP (if installed)**
```bash
cd music-player-pwa
php -S localhost:8000
```

### 2. Open in Browser

Open your browser and go to:
```
http://localhost:8000
```

### 3. Install as App (Optional but Recommended)

**On Desktop (Chrome/Edge):**
- Click the install icon in the address bar (looks like a computer with an arrow)
- Or go to menu → "Install Offline Music Player"

**On Mobile (Chrome/Safari):**
- Chrome: Tap menu → "Add to Home Screen"
- Safari: Tap share button → "Add to Home Screen"

### 4. Add Your Music

1. Click the "📁 Add Songs" button
2. Select MP3, WAV, OGG, or other audio files from your device
3. Your songs are now stored locally in the browser!

### 5. Listen Offline

- Turn off your internet/WiFi
- Open the app (installed or in browser)
- Your music is still there and plays perfectly!
- All songs are stored in IndexedDB in your browser

## Controls

- **Play/Pause** - Click the center button or spacebar
- **Next/Previous** - Use arrow buttons
- **Seek** - Drag the progress bar
- **Volume** - Adjust the volume slider
- **Select Song** - Click any song in the playlist
- **Delete Song** - Click the trash icon next to a song
- **Clear All** - Remove all songs at once

## Lock Screen Controls

When playing on mobile, you can control the music from:
- Lock screen
- Notification panel
- Bluetooth headphones
- Car audio systems

## Technical Details

### Storage
- Songs are stored in **IndexedDB** (browser database)
- App files cached by **Service Worker**
- Typical storage: 50MB - 2GB depending on browser and device
- No server upload - everything stays on your device

### Supported Audio Formats
- MP3
- WAV
- OGG
- M4A
- FLAC (browser-dependent)
- And more (depends on your browser)

### Browser Support
- Chrome/Edge (Desktop & Mobile) ✅
- Firefox (Desktop & Mobile) ✅
- Safari (Desktop & Mobile) ✅
- Opera ✅

## Privacy

- **100% Private** - No data sent to any server
- **No Tracking** - No analytics, no tracking
- **Local Only** - All files stay on your device
- **No Account** - No login, no registration

## Tips

1. **Storage Space**: Check your browser storage settings if you can't add more songs
2. **Backup**: Export your music files regularly (browser data can be cleared)
3. **Battery**: Lock screen playback may use more battery on mobile
4. **Format**: MP3 files work best for compatibility
5. **Organization**: Name your files clearly (shown as song title)

## Troubleshooting

**Songs won't play?**
- Check if the audio format is supported by your browser
- Try re-adding the song

**App doesn't work offline?**
- Make sure you opened it at least once while online
- Check if Service Worker is registered (F12 → Application → Service Workers)

**Storage full?**
- Clear old songs you don't need
- Check browser storage quota in settings

**Can't install the app?**
- Make sure you're using HTTPS (or localhost for testing)
- Try a different browser

## File Structure

```
music-player-pwa/
├── index.html          # Main HTML page
├── styles.css          # Styling
├── app.js             # Player logic & IndexedDB
├── sw.js              # Service Worker (offline cache)
├── manifest.json      # PWA manifest
└── README.md          # This file
```

## How It Works

1. **Service Worker** caches the app files (HTML, CSS, JS)
2. **IndexedDB** stores your audio files as binary blobs
3. **Audio API** plays the files from local storage
4. **Media Session API** provides lock screen controls
5. Everything works offline after initial load!

## Development

Want to customize? The code is simple and well-commented:
- `app.js` - Main player logic, IndexedDB operations
- `styles.css` - All visual styling
- `sw.js` - Offline caching strategy
- `index.html` - Structure and layout

## License

Free to use, modify, and share! No restrictions.

---

Enjoy your music offline! 🎵
