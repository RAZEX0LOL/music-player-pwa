// Internationalization
const I18N = {
    ru: {
        noTracks: 'Пока нет треков',
        addTracksHint: 'Добавьте треки для начала работы!',
        addingTracks: 'Добавление треков',
        tracksAdded: 'Добавлено треков',
        trackDeleted: 'Трек удалён',
        allTracksDeleted: 'Все треки удалены',
        confirmClearAll: 'Вы уверены, что хотите удалить все треки?',
        noTrackPlaying: 'Трек не играет',
        selectTrack: 'Выберите трек для начала',
        nowPlaying: 'Сейчас играет',
        addTracksFirst: 'Пожалуйста, сначала добавьте треки!',
        errorAddingTracks: 'Ошибка добавления треков',
        errorPlayback: 'Ошибка воспроизведения',
        errorInit: 'Ошибка инициализации',
        online: 'Онлайн',
        offline: 'Офлайн - Работает без интернета!',
        ready: 'Готов',
        fileTooLarge: 'Файл слишком большой',
        unsupportedFormat: 'Неподдерживаемый формат',
        noAudioFiles: 'Нет аудио файлов для добавления',
        updateAvailable: 'Доступна новая версия! Обновить?',
        myMusic: 'Моя Музыка',
        offlineMusicPlayer: 'Офлайн Музыкальный Плеер',
        dragDropHint: 'Перетащите аудио/видео файлы сюда',
        shuffleOn: 'Перемешивание включено',
        shuffleOff: 'Перемешивание выключено',
        repeatOff: 'Повтор выключен',
        repeatOne: 'Повтор одного трека',
        repeatAll: 'Повтор всех треков',
        playlistExported: 'Плейлист экспортирован',
        playlistImported: 'Плейлист импортирован',
        sleepTimerSet: 'Таймер сна установлен на',
        minutes: 'минут',
        sleepTimerCancelled: 'Таймер сна отменён',
        tracks: 'треков',
        newPlaylist: 'Новый плейлист',
        enterPlaylistName: 'Введите название плейлиста',
        playlistCreated: 'Плейлист создан',
        playlistRenamed: 'Плейлист переименован',
        playlistDeleted: 'Плейлист удалён',
        cannotDeleteDefault: 'Нельзя удалить основной плейлист',
        confirmDeletePlaylist: 'Удалить плейлист',
        unknownArtist: 'Неизвестный исполнитель',
        unknownAlbum: 'Неизвестный альбом',
        visualizerOn: 'Визуализатор включён',
        visualizerOff: 'Визуализатор выключён',
        lyricsOn: 'Текст песни открыт',
        lyricsOff: 'Текст песни закрыт',
        noLyrics: 'Текст песни не найден',
        themeLight: 'Светлая тема',
        themeDark: 'Тёмная тема'
    },
    en: {
        noTracks: 'No tracks yet',
        addTracksHint: 'Add tracks to get started!',
        addingTracks: 'Adding tracks',
        tracksAdded: 'Tracks added',
        trackDeleted: 'Track deleted',
        allTracksDeleted: 'All tracks deleted',
        confirmClearAll: 'Are you sure you want to delete all tracks?',
        noTrackPlaying: 'No track playing',
        selectTrack: 'Select a track to start',
        nowPlaying: 'Now playing',
        addTracksFirst: 'Please add tracks first!',
        errorAddingTracks: 'Error adding tracks',
        errorPlayback: 'Playback error',
        errorInit: 'Initialization error',
        online: 'Online',
        offline: 'Offline - Works without internet!',
        ready: 'Ready',
        fileTooLarge: 'File too large',
        unsupportedFormat: 'Unsupported format',
        noAudioFiles: 'No audio files to add',
        updateAvailable: 'New version available! Update?',
        myMusic: 'My Music',
        offlineMusicPlayer: 'Offline Music Player',
        dragDropHint: 'Drop audio/video files here',
        shuffleOn: 'Shuffle enabled',
        shuffleOff: 'Shuffle disabled',
        repeatOff: 'Repeat off',
        repeatOne: 'Repeat one track',
        repeatAll: 'Repeat all tracks',
        playlistExported: 'Playlist exported',
        playlistImported: 'Playlist imported',
        sleepTimerSet: 'Sleep timer set to',
        minutes: 'minutes',
        sleepTimerCancelled: 'Sleep timer cancelled',
        tracks: 'tracks',
        newPlaylist: 'New Playlist',
        enterPlaylistName: 'Enter playlist name',
        playlistCreated: 'Playlist created',
        playlistRenamed: 'Playlist renamed',
        playlistDeleted: 'Playlist deleted',
        cannotDeleteDefault: 'Cannot delete default playlist',
        confirmDeletePlaylist: 'Delete playlist',
        unknownArtist: 'Unknown Artist',
        unknownAlbum: 'Unknown Album',
        visualizerOn: 'Visualizer enabled',
        visualizerOff: 'Visualizer disabled',
        lyricsOn: 'Lyrics opened',
        lyricsOff: 'Lyrics closed',
        noLyrics: 'No lyrics found',
        themeLight: 'Light theme',
        themeDark: 'Dark theme'
    }
};

// Error Handler with Toast Notifications
class ErrorHandler {
    static notify(message, error = null, type = 'error') {
        if (error) {
            console.error(message, error);
        }
        this.showToast(message, type);
    }

    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// IndexedDB Manager
class MusicDB {
    constructor() {
        this.dbName = 'MusicPlayerDB';
        this.version = 3; // v3: Fixed playlistId index creation
        this.db = null;
    }

    async init() {
        // Request persistent storage for larger quota
        await this.requestPersistentStorage();

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const oldVersion = event.oldVersion;
                const transaction = event.target.transaction;

                // Version 1: Create tracks store
                if (!db.objectStoreNames.contains('tracks')) {
                    const objectStore = db.createObjectStore('tracks', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('name', 'name', { unique: false });
                    objectStore.createIndex('addedDate', 'addedDate', { unique: false });
                    objectStore.createIndex('playlistId', 'playlistId', { unique: false });
                }

                // Version 2+: Add playlist support
                if (oldVersion < 2) {
                    // Create playlists store
                    if (!db.objectStoreNames.contains('playlists')) {
                        const playlistStore = db.createObjectStore('playlists', { keyPath: 'id' });
                        playlistStore.createIndex('name', 'name', { unique: false });
                        playlistStore.createIndex('createdDate', 'createdDate', { unique: false });

                        // Create default playlist
                        playlistStore.add({
                            id: 'default',
                            name: 'Default Playlist',
                            createdDate: new Date().toISOString()
                        });
                    }

                    // Add playlistId index to tracks if it doesn't exist
                    if (db.objectStoreNames.contains('tracks')) {
                        const tracksStore = transaction.objectStore('tracks');
                        if (!tracksStore.indexNames.contains('playlistId')) {
                            tracksStore.createIndex('playlistId', 'playlistId', { unique: false });
                        }

                        // Migrate existing tracks to default playlist
                        tracksStore.openCursor().onsuccess = (cursorEvent) => {
                            const cursor = cursorEvent.target.result;
                            if (cursor) {
                                const track = cursor.value;
                                if (!track.playlistId) {
                                    track.playlistId = 'default';
                                    cursor.update(track);
                                }
                                cursor.continue();
                            }
                        };
                    }
                }

                // Version 3: Ensure playlistId index exists (fix for buggy v2)
                if (oldVersion === 2 && oldVersion < 3) {
                    if (db.objectStoreNames.contains('tracks')) {
                        const tracksStore = transaction.objectStore('tracks');
                        if (!tracksStore.indexNames.contains('playlistId')) {
                            tracksStore.createIndex('playlistId', 'playlistId', { unique: false });
                            console.log('✅ Fixed missing playlistId index');
                        }

                        // Ensure all tracks have playlistId
                        tracksStore.openCursor().onsuccess = (cursorEvent) => {
                            const cursor = cursorEvent.target.result;
                            if (cursor) {
                                const track = cursor.value;
                                if (!track.playlistId) {
                                    track.playlistId = 'default';
                                    cursor.update(track);
                                }
                                cursor.continue();
                            }
                        };
                    }
                }
            };
        });
    }

    async requestPersistentStorage() {
        // STEP 1: Request persistent storage to unlock maximum quota
        if (navigator.storage && navigator.storage.persist) {
            try {
                // Check if already persisted
                const isPersisted = await navigator.storage.persisted();

                if (!isPersisted) {
                    // Request persistent storage (this unlocks maximum quota)
                    const granted = await navigator.storage.persist();
                    if (granted) {
                        console.log('✅ Persistent storage GRANTED - Maximum quota unlocked!');
                        console.log('   → Data will NEVER be evicted by browser');
                        console.log('   → Available space increased to MAXIMUM');
                    } else {
                        console.log('⚠️ Persistent storage denied - using limited quota');
                        console.log('   → Add app to home screen to unlock more storage');
                    }
                } else {
                    console.log('✅ Persistent storage already active - Maximum quota enabled');
                }
            } catch (error) {
                console.log('Persistent storage request error:', error);
            }
        }

        // STEP 2: Request MAXIMUM quota using legacy API (for older browsers)
        if (navigator.webkitPersistentStorage && navigator.webkitPersistentStorage.requestQuota) {
            try {
                // Request 500 GB (browser will grant maximum available)
                const requestedBytes = 500 * 1024 * 1024 * 1024; // 500 GB
                navigator.webkitPersistentStorage.requestQuota(
                    requestedBytes,
                    (grantedBytes) => {
                        const grantedGB = (grantedBytes / (1024 * 1024 * 1024)).toFixed(2);
                        console.log(`✅ Legacy quota granted: ${grantedGB} GB`);
                    },
                    (error) => {
                        console.log('Legacy quota request failed:', error);
                    }
                );
            } catch (error) {
                console.log('Legacy quota API error:', error);
            }
        }

        // STEP 3: Estimate and display available storage
        if (navigator.storage && navigator.storage.estimate) {
            try {
                const estimate = await navigator.storage.estimate();
                const usedMB = (estimate.usage / (1024 * 1024)).toFixed(1);
                const quotaMB = (estimate.quota / (1024 * 1024)).toFixed(0);
                const quotaGB = (estimate.quota / (1024 * 1024 * 1024)).toFixed(2);
                const percentUsed = ((estimate.usage / estimate.quota) * 100).toFixed(1);

                console.log('═══════════════════════════════════════');
                console.log('📊 STORAGE QUOTA INFORMATION:');
                console.log(`   Used: ${usedMB} MB`);
                console.log(`   Available: ${quotaMB} MB (${quotaGB} GB)`);
                console.log(`   Usage: ${percentUsed}%`);
                console.log('═══════════════════════════════════════');

                // Estimate how many tracks can fit
                const avgTrackSizeMB = 4; // Average MP3 track ~4MB
                const availableSpace = estimate.quota - estimate.usage;
                const estimatedTracks = Math.floor(availableSpace / (avgTrackSizeMB * 1024 * 1024));
                console.log(`🎵 Estimated capacity: ~${estimatedTracks.toLocaleString()} tracks (${avgTrackSizeMB}MB each)`);
                console.log('═══════════════════════════════════════');

            } catch (error) {
                console.log('Storage estimate error:', error);
            }
        }

        // STEP 4: Request File System API quota (for maximum storage on supporting browsers)
        if (window.requestFileSystem || window.webkitRequestFileSystem) {
            try {
                const requestFS = window.requestFileSystem || window.webkitRequestFileSystem;
                const requestedBytes = 500 * 1024 * 1024 * 1024; // 500 GB

                requestFS(
                    window.PERSISTENT,
                    requestedBytes,
                    (fs) => {
                        console.log('✅ File System quota granted');
                    },
                    (error) => {
                        // Silent fail - this API is deprecated but helps on older Chrome
                    }
                );
            } catch (error) {
                // Silent fail
            }
        }
    }

    async addTrack(file, playlistId = 'default', metadata = null) {
        // Convert File to ArrayBuffer BEFORE creating transaction
        // (to avoid transaction timeout)
        // Store ArrayBuffer instead of Blob/File for maximum compatibility
        const arrayBuffer = await file.arrayBuffer();

        // NOW create transaction after async work is done
        const transaction = this.db.transaction(['tracks'], 'readwrite');
        const store = transaction.objectStore('tracks');

        const track = {
            name: file.name,
            arrayBuffer: arrayBuffer,  // Store raw ArrayBuffer (most compatible)
            size: file.size,
            type: file.type,
            addedDate: new Date().toISOString(),
            playlistId: playlistId,
            // Metadata from ID3 tags
            artist: metadata?.artist || null,
            album: metadata?.album || null,
            title: metadata?.title || null,
            year: metadata?.year || null,
            genre: metadata?.genre || null,
            albumArt: metadata?.albumArt || null,
            lyrics: metadata?.lyrics || null
        };

        return new Promise((resolve, reject) => {
            const request = store.add(track);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllTracks() {
        const transaction = this.db.transaction(['tracks'], 'readonly');
        const store = transaction.objectStore('tracks');

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getTrack(id) {
        const transaction = this.db.transaction(['tracks'], 'readonly');
        const store = transaction.objectStore('tracks');

        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteTrack(id) {
        const transaction = this.db.transaction(['tracks'], 'readwrite');
        const store = transaction.objectStore('tracks');

        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clearAll() {
        const transaction = this.db.transaction(['tracks'], 'readwrite');
        const store = transaction.objectStore('tracks');

        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Playlist methods
    async getAllPlaylists() {
        const transaction = this.db.transaction(['playlists'], 'readonly');
        const store = transaction.objectStore('playlists');

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getPlaylist(id) {
        const transaction = this.db.transaction(['playlists'], 'readonly');
        const store = transaction.objectStore('playlists');

        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async createPlaylist(name) {
        const transaction = this.db.transaction(['playlists'], 'readwrite');
        const store = transaction.objectStore('playlists');

        const playlist = {
            id: 'playlist_' + Date.now(),
            name: name,
            createdDate: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.add(playlist);
            request.onsuccess = () => resolve(playlist);
            request.onerror = () => reject(request.error);
        });
    }

    async renamePlaylist(id, newName) {
        const transaction = this.db.transaction(['playlists'], 'readwrite');
        const store = transaction.objectStore('playlists');

        return new Promise(async (resolve, reject) => {
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const playlist = getRequest.result;
                if (playlist) {
                    playlist.name = newName;
                    const updateRequest = store.put(playlist);
                    updateRequest.onsuccess = () => resolve(playlist);
                    updateRequest.onerror = () => reject(updateRequest.error);
                } else {
                    reject(new Error('Playlist not found'));
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async deletePlaylist(id) {
        if (id === 'default') {
            throw new Error('Cannot delete default playlist');
        }

        const transaction = this.db.transaction(['playlists', 'tracks'], 'readwrite');
        const playlistStore = transaction.objectStore('playlists');
        const tracksStore = transaction.objectStore('tracks');

        return new Promise((resolve, reject) => {
            // Delete all tracks in this playlist
            const index = tracksStore.index('playlistId');
            const tracksRequest = index.openCursor(IDBKeyRange.only(id));

            tracksRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                } else {
                    // All tracks deleted, now delete the playlist
                    const deleteRequest = playlistStore.delete(id);
                    deleteRequest.onsuccess = () => resolve();
                    deleteRequest.onerror = () => reject(deleteRequest.error);
                }
            };
            tracksRequest.onerror = () => reject(tracksRequest.error);
        });
    }

    async getTracksByPlaylist(playlistId) {
        const transaction = this.db.transaction(['tracks'], 'readonly');
        const store = transaction.objectStore('tracks');
        const index = store.index('playlistId');

        return new Promise((resolve, reject) => {
            const request = index.getAll(IDBKeyRange.only(playlistId));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// Music Player
class MusicPlayer {
    constructor() {
        this.db = new MusicDB();
        this.audio = document.getElementById('audioPlayer');
        this.audio.loop = false; // Explicitly disable looping - handled manually via repeatMode
        this.playlist = [];
        this.filteredPlaylist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.currentBlobUrl = null; // Fix memory leak
        this.shuffleMode = false;
        this.repeatMode = 'none'; // 'none', 'one', 'all'
        this.sleepTimer = null;
        this.searchTerm = '';
        this.lang = navigator.language.startsWith('ru') ? 'ru' : 'en';

        // File validation constants
        this.MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
        this.ALLOWED_TYPES = ['audio/', 'video/mp4', 'video/x-m4v'];

        // Playlist management
        this.currentPlaylist = 'default';
        this.playlists = [];

        // Visualizer
        this.visualizerActive = false;
        this.visualizerWarningShown = false;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;

        // Theme
        this.currentTheme = localStorage.getItem('theme') || 'dark';

        // Lyrics
        this.lyricsVisible = false;

        // Cast
        this.castSession = null;
        this.castPlayer = null;
        this.isCasting = false;
        this.castBlobUrl = null; // Track Cast blob URL for cleanup

        this.initElements();
        this.initEventListeners();
        this.init();
    }

    initElements() {
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.volumeBar = document.getElementById('volumeBar');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.trackList = document.getElementById('trackList');
        this.fileInput = document.getElementById('fileInput');
        this.addTracksBtn = document.getElementById('addTracksBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.currentTrackTitle = document.getElementById('currentTrackTitle');
        this.currentTrackArtist = document.getElementById('currentTrackArtist');
        this.vinylDisc = document.getElementById('vinylDisc');
        this.trackCount = document.getElementById('trackCount');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');

        // New elements (v2.0)
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.searchInput = document.getElementById('searchInput');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFileInput = document.getElementById('importFileInput');
        this.sleepTimerBtn = document.getElementById('sleepTimerBtn');
        this.speedBtn = document.getElementById('speedBtn');

        // New elements (v3.0)
        this.playlistSelector = document.getElementById('playlistSelector');
        this.newPlaylistBtn = document.getElementById('newPlaylistBtn');
        this.renamePlaylistBtn = document.getElementById('renamePlaylistBtn');
        this.deletePlaylistBtn = document.getElementById('deletePlaylistBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.visualizerBtn = document.getElementById('visualizerBtn');
        this.lyricsBtn = document.getElementById('lyricsBtn');
        this.visualizerCanvas = document.getElementById('visualizerCanvas');
        this.albumArtImg = document.getElementById('albumArtImg');
        this.currentTrackAlbum = document.getElementById('currentTrackAlbum');
        this.lyricsPanel = document.getElementById('lyricsPanel');
        this.lyricsContent = document.getElementById('lyricsContent');
        this.closeLyricsBtn = document.getElementById('closeLyricsBtn');
        this.castBtn = document.getElementById('castBtn');
    }

    initEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.progressBar.addEventListener('input', (e) => this.seek(e.target.value));
        this.volumeBar.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.addTracksBtn.addEventListener('click', () => this.handleAddTracksClick());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.clearAllBtn.addEventListener('click', () => this.clearAllTracks());

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.playNext());

        // Prevent audio stalling on lock screen
        this.audio.addEventListener('stalled', () => {
            console.log('Audio stalled, attempting to resume...');
            if (this.isPlaying && this.audio.paused) {
                this.audio.play().catch(err => console.log('Resume from stall failed:', err));
            }
        });

        // Media Session playback state updates for lock screen
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing';
            }
            // Resume AudioContext if suspended (for lock screen playback)
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume().catch(err => console.log('AudioContext resume failed:', err));
            }
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'paused';
            }
        });

        window.addEventListener('online', () => this.updateOnlineStatus(true));
        window.addEventListener('offline', () => this.updateOnlineStatus(false));

        // Keep AudioContext active for background/lock screen playback
        document.addEventListener('visibilitychange', () => {
            // Try to resume when page becomes visible
            if (this.audioContext && this.audioContext.state === 'suspended' && !document.hidden) {
                this.audioContext.resume().catch(err => console.log('Resume on visibility failed:', err));
            }
        });

        // Resume AudioContext when page becomes active (for lock screen)
        window.addEventListener('focus', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume().catch(err => console.log('Resume on focus failed:', err));
            }
        });

        // Aggressive AudioContext resume - check every second while playing
        setInterval(() => {
            if (this.audioContext && this.isPlaying && this.audioContext.state === 'suspended') {
                this.audioContext.resume().catch(err => console.log('Interval resume failed:', err));
            }
        }, 1000);

        // New feature event listeners
        if (this.shuffleBtn) {
            this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        }
        if (this.repeatBtn) {
            this.repeatBtn.addEventListener('click', () => this.cycleRepeat());
        }
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => this.exportPlaylist());
        }
        if (this.importBtn) {
            this.importBtn.addEventListener('click', () => this.importFileInput.click());
        }
        if (this.importFileInput) {
            this.importFileInput.addEventListener('change', (e) => this.importPlaylist(e));
        }
        if (this.sleepTimerBtn) {
            this.sleepTimerBtn.addEventListener('click', () => this.showSleepTimerDialog());
        }
        if (this.speedBtn) {
            this.speedBtn.addEventListener('click', () => this.cyclePlaybackSpeed());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcut(e));

        // v3.0 feature event listeners
        if (this.playlistSelector) {
            this.playlistSelector.addEventListener('change', (e) => this.switchPlaylist(e.target.value));
        }
        if (this.newPlaylistBtn) {
            this.newPlaylistBtn.addEventListener('click', () => this.createNewPlaylist());
        }
        if (this.renamePlaylistBtn) {
            this.renamePlaylistBtn.addEventListener('click', () => this.renameCurrentPlaylist());
        }
        if (this.deletePlaylistBtn) {
            this.deletePlaylistBtn.addEventListener('click', () => this.deleteCurrentPlaylist());
        }
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        if (this.visualizerBtn) {
            this.visualizerBtn.addEventListener('click', () => this.toggleVisualizer());
        }
        if (this.lyricsBtn) {
            this.lyricsBtn.addEventListener('click', () => this.toggleLyrics());
        }
        if (this.closeLyricsBtn) {
            this.closeLyricsBtn.addEventListener('click', () => this.toggleLyrics());
        }
        if (this.castBtn) {
            this.castBtn.addEventListener('click', () => this.toggleCast());
        }

        // Drag and drop support for offline file uploads
        const dropZone = document.body;
        dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        dropZone.addEventListener('drop', (e) => this.handleDrop(e));
    }

    async init() {
        try {
            await this.db.init();
            await this.loadPlaylists();
            await this.loadPlaylist();
            this.setVolume(70);
            this.updateOnlineStatus(navigator.onLine);
            this.registerServiceWorker();
            this.initTheme();
            // Don't setup visualizer until needed - prevents AudioContext suspension on lock screen
            this.initCast();
        } catch (error) {
            console.error('Initialization error:', error);
            this.statusText.textContent = 'Ошибка инициализации';
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registered:', registration);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available!
                            const message = I18N[this.lang].updateAvailable;
                            if (confirm(message)) {
                                window.location.reload();
                            }
                        }
                    });
                });

                // Check for updates every hour
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    updateOnlineStatus(isOnline) {
        this.statusIndicator.className = isOnline ? 'online' : 'offline';
        this.statusText.textContent = isOnline ? 'Онлайн' : 'Офлайн - Работает без интернета!';
    }

    handleAddTracksClick() {
        // Try to open file picker
        // Note: iOS Safari may block this in offline PWA mode
        // In that case, users can use drag-and-drop instead
        try {
            this.fileInput.click();
        } catch (error) {
            console.error('File picker error:', error);
            alert('Используйте перетаскивание файлов (drag & drop) для добавления треков офлайн');
        }
    }

    async handleFileSelect(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const i18n = I18N[this.lang];
        this.statusText.textContent = `${i18n.addingTracks} ${files.length} ${i18n.tracks}...`;

        try {
            let addedCount = 0;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file
                try {
                    this.validateFile(file);
                } catch (validationError) {
                    ErrorHandler.notify(`${file.name}: ${validationError.message}`, null, 'warning');
                    continue;
                }

                const progress = Math.round((i / files.length) * 100);
                this.statusText.textContent = `${i18n.addingTracks} ${i + 1}/${files.length} (${progress}%)`;

                // Parse ID3 tags if available
                const metadata = await this.parseID3Tags(file);
                await this.db.addTrack(file, this.currentPlaylist, metadata);
                addedCount++;
            }

            await this.loadPlaylist();
            this.statusText.textContent = `${i18n.tracksAdded}: ${addedCount}!`;
            ErrorHandler.notify(`${i18n.tracksAdded}: ${addedCount}`, null, 'success');

            // Show storage info after adding tracks
            this.showStorageInfo();

            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
        } catch (error) {
            console.error('Error adding tracks:', error);
            this.statusText.textContent = i18n.errorAddingTracks + ': ' + error.message;
            ErrorHandler.notify(i18n.errorAddingTracks, error);
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 3000);
        }

        event.target.value = '';
    }

    validateFile(file) {
        const i18n = I18N[this.lang];

        // Check file size
        if (file.size > this.MAX_FILE_SIZE) {
            throw new Error(`${i18n.fileTooLarge}: ${this.formatFileSize(file.size)}`);
        }

        // Check file type
        const isAllowedType = this.ALLOWED_TYPES.some(type => file.type.startsWith(type));
        const hasValidExtension = file.name.match(/\.(mp3|wav|ogg|m4a|flac|mp4|m4v|aac|wma|webm|mpeg)$/i);

        if (!isAllowedType && !hasValidExtension) {
            throw new Error(`${i18n.unsupportedFormat}: ${file.type || file.name}`);
        }

        return true;
    }

    async loadPlaylist() {
        try {
            this.playlist = await this.db.getTracksByPlaylist(this.currentPlaylist);
            this.renderPlaylist();
            this.updateTrackCount();
        } catch (error) {
            console.error('Error loading playlist:', error);
        }
    }

    renderPlaylist() {
        const i18n = I18N[this.lang];
        const filteredPlaylist = this.getFilteredPlaylist();

        if (this.playlist.length === 0) {
            this.trackList.innerHTML = `
                <div class="empty-state">
                    <p>${i18n.noTracks}</p>
                    <p class="hint">${i18n.addTracksHint}</p>
                </div>
            `;
            return;
        }

        if (filteredPlaylist.length === 0) {
            this.trackList.innerHTML = `
                <div class="empty-state">
                    <p>No matches found</p>
                    <p class="hint">Try a different search term</p>
                </div>
            `;
            return;
        }

        this.trackList.innerHTML = filteredPlaylist.map((track) => {
            const actualIndex = this.playlist.findIndex(t => t.id === track.id);
            return `
                <div class="track-item ${actualIndex === this.currentIndex ? 'active' : ''}" data-index="${actualIndex}">
                    <div class="track-item-info">
                        <div class="track-item-title">${this.escapeHtml(track.name)}</div>
                        <div class="track-item-duration">${this.formatFileSize(track.size)}</div>
                    </div>
                    <button class="delete-btn" data-id="${track.id}" onclick="event.stopPropagation()" aria-label="Delete track">🗑️</button>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.track-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-btn')) {
                    const index = parseInt(item.dataset.index);
                    if (!isNaN(index) && index >= 0) {
                        this.playTrackAtIndex(index);
                    }
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                if (!isNaN(id)) {
                    await this.deleteTrack(id);
                }
            });
        });
    }

    async deleteTrack(id) {
        const i18n = I18N[this.lang];
        try {
            await this.db.deleteTrack(id);

            const wasPlaying = this.isPlaying;
            const deletedIndex = this.playlist.findIndex(s => s.id === id);

            if (deletedIndex === this.currentIndex) {
                this.audio.pause();
                // Note: isPlaying and updatePlayButton() handled by pause event listener
            }

            await this.loadPlaylist();

            if (this.playlist.length > 0 && deletedIndex === this.currentIndex) {
                this.currentIndex = Math.min(this.currentIndex, this.playlist.length - 1);
                if (wasPlaying) {
                    await this.playTrackAtIndex(this.currentIndex);
                }
            } else if (deletedIndex < this.currentIndex) {
                this.currentIndex--;
            }

            this.statusText.textContent = i18n.trackDeleted;
            ErrorHandler.notify(i18n.trackDeleted, null, 'success');
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
        } catch (error) {
            console.error('Error deleting track:', error);
            ErrorHandler.notify('Error deleting track', error);
        }
    }

    async clearAllTracks() {
        const i18n = I18N[this.lang];
        if (!confirm(i18n.confirmClearAll)) return;

        try {
            this.audio.pause();
            // Note: isPlaying and updatePlayButton() handled by pause event listener

            await this.db.clearAll();
            await this.loadPlaylist();

            this.currentIndex = 0;
            this.currentTrackTitle.textContent = i18n.noTrackPlaying;
            this.currentTrackArtist.textContent = i18n.selectTrack;
            this.vinylDisc.classList.remove('spinning');

            this.statusText.textContent = i18n.allTracksDeleted;
            ErrorHandler.notify(i18n.allTracksDeleted, null, 'success');
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
        } catch (error) {
            console.error('Error clearing tracks:', error);
            ErrorHandler.notify('Error clearing tracks', error);
        }
    }

    async playTrackAtIndex(index) {
        if (index < 0 || index >= this.playlist.length) return;

        this.currentIndex = index;
        const track = this.playlist[index];

        try {
            const trackData = await this.db.getTrack(track.id);

            // Recreate Blob from stored data (supports multiple storage formats)
            let fileBlob;
            if (trackData.arrayBuffer) {
                // New format: ArrayBuffer (most compatible)
                fileBlob = new Blob([trackData.arrayBuffer], { type: trackData.type });
            } else if (trackData.blob) {
                // Old format: Blob
                fileBlob = trackData.blob;
            } else if (trackData.file) {
                // Oldest format: File
                fileBlob = trackData.file;
            }

            // FIX MEMORY LEAK: Revoke old blob URL before creating new one
            if (this.currentBlobUrl) {
                URL.revokeObjectURL(this.currentBlobUrl);
            }

            const url = URL.createObjectURL(fileBlob);
            this.currentBlobUrl = url;

            this.audio.src = url;
            this.audio.load(); // Ensure video/audio element loads the source

            try {
                await this.audio.play();
                // Note: isPlaying state updated by 'play' event listener
            } catch (playError) {
                console.error('Playback error:', playError);
                ErrorHandler.notify(I18N[this.lang].errorPlayback, playError, 'error');
            }

            // Note: updatePlayButton() handled by event listener
            this.updateTrackMetadata(track); // v3.0: Update with full metadata
            this.vinylDisc.classList.add('spinning');
            this.renderPlaylist();
            this.updateMediaSession(track);
            this.updateMediaSessionPositionState();
        } catch (error) {
            console.error('Error playing track:', error);
            const i18n = I18N[this.lang];
            this.statusText.textContent = i18n.errorPlayback + ': ' + error.message;
            ErrorHandler.notify(i18n.errorPlayback, error);
        }
    }

    async togglePlay() {
        const i18n = I18N[this.lang];
        if (this.playlist.length === 0) {
            ErrorHandler.notify(i18n.addTracksFirst, null, 'warning');
            return;
        }

        if (this.audio.src === '') {
            await this.playTrackAtIndex(0);
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
            this.vinylDisc.classList.remove('spinning');
        } else {
            try {
                await this.audio.play();
                this.vinylDisc.classList.add('spinning');
            } catch (error) {
                console.error('Play error:', error);
            }
        }

        // Note: isPlaying state and updatePlayButton() are now handled by audio event listeners
    }

    async playNext() {
        if (this.playlist.length === 0) return;

        // Repeat one track
        if (this.repeatMode === 'one') {
            await this.playTrackAtIndex(this.currentIndex);
            return;
        }

        // Calculate next index
        let nextIndex;
        if (this.shuffleMode) {
            nextIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            nextIndex = this.currentIndex + 1;
        }

        // Check if we've reached the end
        if (nextIndex >= this.playlist.length) {
            if (this.repeatMode === 'all') {
                // Loop back to start
                nextIndex = 0;
            } else {
                // repeatMode === 'none' - stop playing
                this.audio.pause();
                this.vinylDisc.classList.remove('spinning');
                return;
            }
        }

        this.currentIndex = nextIndex;
        await this.playTrackAtIndex(this.currentIndex);
    }

    async playPrevious() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        await this.playTrackAtIndex(this.currentIndex);
    }

    updatePlayButton() {
        this.playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }

    updateNowPlaying(trackName) {
        const name = trackName.replace(/\.[^/.]+$/, '');
        this.currentTrackTitle.textContent = name;
        this.currentTrackArtist.textContent = 'Сейчас играет';
    }

    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBar.value = progress;
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
            this.syncLyrics(); // v3.0: Sync lyrics with current time
        }
    }

    updateDuration() {
        if (this.audio.duration) {
            this.durationEl.textContent = this.formatTime(this.audio.duration);
            this.updateMediaSessionPositionState();
        }
    }

    seek(value) {
        if (this.audio.duration) {
            const time = (value / 100) * this.audio.duration;
            this.audio.currentTime = time;
        }
    }

    setVolume(value) {
        this.audio.volume = value / 100;
    }

    updateTrackCount() {
        this.trackCount.textContent = this.playlist.length;
    }

    async showStorageInfo() {
        // Show storage usage info to user
        if (navigator.storage && navigator.storage.estimate) {
            try {
                const estimate = await navigator.storage.estimate();
                const usedMB = (estimate.usage / (1024 * 1024)).toFixed(1);
                const quotaMB = (estimate.quota / (1024 * 1024)).toFixed(0);
                const percentUsed = ((estimate.usage / estimate.quota) * 100).toFixed(1);

                console.log(`📊 Storage: ${usedMB} MB / ${quotaMB} MB (${percentUsed}%)`);

                // Optionally show in status (uncomment if you want to display to user)
                // this.statusText.textContent = `Хранилище: ${usedMB} МБ / ${quotaMB} МБ`;
            } catch (error) {
                console.log('Storage info error:', error);
            }
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateMediaSession(track) {
        if ('mediaSession' in navigator) {
            const i18n = I18N[this.lang];
            const title = track.title || track.name.replace(/\.[^/.]+$/, '');
            const artist = track.artist || i18n.myMusic;
            const album = track.album || i18n.offlineMusicPlayer;
            const artwork = track.albumArt ? [{ src: track.albumArt, sizes: '512x512', type: 'image/jpeg' }] : [];

            navigator.mediaSession.metadata = new MediaMetadata({
                title: title,
                artist: artist,
                album: album,
                artwork: artwork
            });

            // Basic playback controls
            navigator.mediaSession.setActionHandler('play', () => this.togglePlay());
            navigator.mediaSession.setActionHandler('pause', () => this.togglePlay());
            navigator.mediaSession.setActionHandler('previoustrack', () => this.playPrevious());
            navigator.mediaSession.setActionHandler('nexttrack', () => this.playNext());

            // Seek controls for lock screen rewind/fast-forward
            navigator.mediaSession.setActionHandler('seekbackward', (details) => {
                const skipTime = details.seekOffset || 10;
                this.audio.currentTime = Math.max(0, this.audio.currentTime - skipTime);
            });

            navigator.mediaSession.setActionHandler('seekforward', (details) => {
                const skipTime = details.seekOffset || 10;
                this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + skipTime);
            });

            // Direct seek to specific position
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.fastSeek && 'fastSeek' in this.audio) {
                    this.audio.fastSeek(details.seekTime);
                } else {
                    this.audio.currentTime = details.seekTime;
                }
            });
        }
    }

    // Update Media Session position state (called during playback)
    updateMediaSessionPositionState() {
        if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
            if (this.audio.duration && !isNaN(this.audio.duration)) {
                try {
                    navigator.mediaSession.setPositionState({
                        duration: this.audio.duration,
                        playbackRate: this.audio.playbackRate,
                        position: this.audio.currentTime
                    });
                } catch (error) {
                    // Ignore errors if position state is not supported
                    console.log('Position state not supported:', error);
                }
            }
        }
    }

    // Keyboard shortcuts
    handleKeyboardShortcut(event) {
        // Don't interfere with input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

        switch(event.key) {
            case ' ':
                event.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowRight':
                if (event.shiftKey) {
                    // Skip forward 10 seconds
                    this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 10);
                } else {
                    this.playNext();
                }
                break;
            case 'ArrowLeft':
                if (event.shiftKey) {
                    // Skip backward 10 seconds
                    this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
                } else {
                    this.playPrevious();
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.audio.volume = Math.min(1, this.audio.volume + 0.1);
                this.volumeBar.value = this.audio.volume * 100;
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.audio.volume = Math.max(0, this.audio.volume - 0.1);
                this.volumeBar.value = this.audio.volume * 100;
                break;
            case 'm':
            case 'M':
                // Mute/unmute
                this.audio.muted = !this.audio.muted;
                break;
            case 's':
            case 'S':
                // Toggle shuffle
                this.toggleShuffle();
                break;
            case 'r':
            case 'R':
                // Cycle repeat
                this.cycleRepeat();
                break;
        }
    }

    // Shuffle functionality
    toggleShuffle() {
        this.shuffleMode = !this.shuffleMode;
        const i18n = I18N[this.lang];
        const message = this.shuffleMode ? i18n.shuffleOn : i18n.shuffleOff;

        if (this.shuffleBtn) {
            this.shuffleBtn.classList.toggle('active', this.shuffleMode);
        }

        ErrorHandler.notify(message, null, 'info');
    }

    // Repeat functionality
    cycleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];

        const i18n = I18N[this.lang];
        let message = i18n.repeatOff;
        let icon = '🔁';

        if (this.repeatMode === 'all') {
            message = i18n.repeatAll;
            icon = '🔁';
        } else if (this.repeatMode === 'one') {
            message = i18n.repeatOne;
            icon = '🔂';
        }

        if (this.repeatBtn) {
            this.repeatBtn.textContent = icon;
            this.repeatBtn.classList.toggle('active', this.repeatMode !== 'none');
        }

        ErrorHandler.notify(message, null, 'info');
    }

    // Search/Filter functionality
    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase();
        this.renderPlaylist();
    }

    getFilteredPlaylist() {
        if (!this.searchTerm) {
            return this.playlist;
        }
        return this.playlist.filter(track =>
            track.name.toLowerCase().includes(this.searchTerm)
        );
    }

    // Export playlist to JSON
    async exportPlaylist() {
        try {
            const i18n = I18N[this.lang];
            const data = {
                version: 1,
                exportDate: new Date().toISOString(),
                tracks: this.playlist.map(t => ({
                    name: t.name,
                    size: t.size,
                    type: t.type,
                    addedDate: t.addedDate
                }))
            };

            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `music-playlist-${Date.now()}.json`;
            a.click();

            URL.revokeObjectURL(url);
            ErrorHandler.notify(i18n.playlistExported, null, 'success');
        } catch (error) {
            ErrorHandler.notify('Export failed', error);
        }
    }

    // Import playlist from JSON
    async importPlaylist(event) {
        try {
            const i18n = I18N[this.lang];
            const file = event.target.files[0];
            if (!file) return;

            const text = await file.text();
            const data = JSON.parse(text);

            // Show info about what was imported
            ErrorHandler.notify(`${i18n.playlistImported}: ${data.tracks.length} ${i18n.tracks}`, null, 'success');
        } catch (error) {
            ErrorHandler.notify('Import failed', error);
        }

        event.target.value = '';
    }

    // Sleep timer functionality
    showSleepTimerDialog() {
        const i18n = I18N[this.lang];
        const minutes = prompt(`${i18n.sleepTimerSet}?\n\n${i18n.minutes}:`, '30');

        if (minutes === null) return;

        const min = parseInt(minutes);
        if (isNaN(min) || min <= 0) {
            ErrorHandler.notify('Invalid time', null, 'warning');
            return;
        }

        // Cancel existing timer
        if (this.sleepTimer) {
            clearTimeout(this.sleepTimer);
        }

        // Set new timer
        this.sleepTimer = setTimeout(() => {
            this.audio.pause();
            // Note: isPlaying and updatePlayButton() handled by pause event listener
            this.vinylDisc.classList.remove('spinning');
            ErrorHandler.notify('Sleep timer ended', null, 'info');
        }, min * 60 * 1000);

        ErrorHandler.notify(`${i18n.sleepTimerSet} ${min} ${i18n.minutes}`, null, 'success');
    }

    cancelSleepTimer() {
        if (this.sleepTimer) {
            clearTimeout(this.sleepTimer);
            this.sleepTimer = null;
            const i18n = I18N[this.lang];
            ErrorHandler.notify(i18n.sleepTimerCancelled, null, 'info');
        }
    }

    // Playback speed control
    cyclePlaybackSpeed() {
        const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
        const currentIndex = speeds.indexOf(this.audio.playbackRate);
        const nextIndex = (currentIndex + 1) % speeds.length;
        this.audio.playbackRate = speeds[nextIndex];

        if (this.speedBtn) {
            this.speedBtn.textContent = `${speeds[nextIndex]}x`;
        }

        ErrorHandler.notify(`Speed: ${speeds[nextIndex]}x`, null, 'info');
    }

    // Drag and drop handlers for offline file uploads
    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
        document.body.classList.add('drag-over');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.target === document.body) {
            document.body.classList.remove('drag-over');
        }
    }

    async handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        document.body.classList.remove('drag-over');

        const i18n = I18N[this.lang];
        const files = Array.from(event.dataTransfer.files).filter(file =>
            file.type.startsWith('audio/') ||
            file.type.startsWith('video/') ||
            file.name.match(/\.(mp3|wav|ogg|m4a|flac|mp4|m4v|aac|wma|webm|mpeg)$/i)
        );

        if (files.length === 0) {
            this.statusText.textContent = i18n.noAudioFiles;
            ErrorHandler.notify(i18n.noAudioFiles, null, 'warning');
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
            return;
        }

        this.statusText.textContent = `${i18n.addingTracks} ${files.length} ${i18n.tracks}...`;

        try {
            let addedCount = 0;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file
                try {
                    this.validateFile(file);
                } catch (validationError) {
                    ErrorHandler.notify(`${file.name}: ${validationError.message}`, null, 'warning');
                    continue;
                }

                const progress = Math.round((i / files.length) * 100);
                this.statusText.textContent = `${i18n.addingTracks} ${i + 1}/${files.length} (${progress}%)`;

                // Parse ID3 tags if available
                const metadata = await this.parseID3Tags(file);
                await this.db.addTrack(file, this.currentPlaylist, metadata);
                addedCount++;
            }

            await this.loadPlaylist();
            this.statusText.textContent = `${i18n.tracksAdded}: ${addedCount}!`;
            ErrorHandler.notify(`${i18n.tracksAdded}: ${addedCount}`, null, 'success');
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
        } catch (error) {
            console.error('Error adding tracks via drag and drop:', error);
            this.statusText.textContent = i18n.errorAddingTracks;
            ErrorHandler.notify(i18n.errorAddingTracks, error);
        }
    }

    // ========== v3.0 ADVANCED FEATURES ==========

    // ID3 Tag Parsing
    async parseID3Tags(file) {
        if (typeof jsmediatags === 'undefined') {
            return null; // Library not loaded
        }

        return new Promise((resolve) => {
            jsmediatags.read(file, {
                onSuccess: (tag) => {
                    const tags = tag.tags;
                    const metadata = {
                        title: tags.title || null,
                        artist: tags.artist || null,
                        album: tags.album || null,
                        year: tags.year || null,
                        genre: tags.genre?.data || null,
                        albumArt: null,
                        lyrics: tags.lyrics?.lyrics || tags.USLT?.lyrics || null
                    };

                    // Extract album art
                    if (tags.picture) {
                        try {
                            const picture = tags.picture;
                            const base64String = btoa(
                                picture.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
                            );
                            metadata.albumArt = `data:${picture.format};base64,${base64String}`;
                        } catch (err) {
                            console.error('Error extracting album art:', err);
                        }
                    }

                    resolve(metadata);
                },
                onError: (error) => {
                    console.log('ID3 parsing error:', error);
                    resolve(null);
                }
            });
        });
    }

    // Update track metadata display
    updateTrackMetadata(track) {
        const i18n = I18N[this.lang];
        const title = track.title || track.name.replace(/\.[^/.]+$/, '');
        const artist = track.artist || i18n.unknownArtist;
        const album = track.album || '';

        this.currentTrackTitle.textContent = title;
        this.currentTrackArtist.textContent = artist;
        if (this.currentTrackAlbum) {
            this.currentTrackAlbum.textContent = album;
            this.currentTrackAlbum.style.display = album ? 'block' : 'none';
        }

        this.showAlbumArtOrVinyl(track);
    }

    // Show album art or vinyl disc
    showAlbumArtOrVinyl(track) {
        if (this.visualizerActive) return; // Don't change if visualizer is active

        if (track && track.albumArt && this.albumArtImg) {
            this.albumArtImg.src = track.albumArt;
            this.albumArtImg.style.display = 'block';
            this.vinylDisc.style.display = 'none';
        } else {
            if (this.albumArtImg) {
                this.albumArtImg.style.display = 'none';
            }
            this.vinylDisc.style.display = 'block';
        }
    }

    // Playlist Management
    async loadPlaylists() {
        try {
            this.playlists = await this.db.getAllPlaylists();
            if (this.playlistSelector) {
                this.playlistSelector.innerHTML = this.playlists.map(p =>
                    `<option value="${p.id}">${this.escapeHtml(p.name)}</option>`
                ).join('');
                this.playlistSelector.value = this.currentPlaylist;
            }
        } catch (error) {
            console.error('Error loading playlists:', error);
        }
    }

    async switchPlaylist(playlistId) {
        this.currentPlaylist = playlistId;
        await this.loadPlaylist();
    }

    async createNewPlaylist() {
        const i18n = I18N[this.lang];
        const name = prompt(i18n.enterPlaylistName, i18n.newPlaylist);
        if (!name || name.trim() === '') return;

        try {
            const playlist = await this.db.createPlaylist(name.trim());
            await this.loadPlaylists();
            this.playlistSelector.value = playlist.id;
            this.currentPlaylist = playlist.id;
            await this.loadPlaylist();
            ErrorHandler.notify(i18n.playlistCreated + ': ' + name, null, 'success');
        } catch (error) {
            ErrorHandler.notify('Error creating playlist', error);
        }
    }

    async renameCurrentPlaylist() {
        const i18n = I18N[this.lang];

        if (this.currentPlaylist === 'default') {
            ErrorHandler.notify('Cannot rename default playlist', null, 'warning');
            return;
        }

        try {
            const playlist = await this.db.getPlaylist(this.currentPlaylist);
            if (!playlist) return;

            const newName = prompt(i18n.enterPlaylistName, playlist.name);
            if (!newName || newName.trim() === '') return;

            await this.db.renamePlaylist(this.currentPlaylist, newName.trim());
            await this.loadPlaylists();
            ErrorHandler.notify(i18n.playlistRenamed, null, 'success');
        } catch (error) {
            ErrorHandler.notify('Error renaming playlist', error);
        }
    }

    async deleteCurrentPlaylist() {
        const i18n = I18N[this.lang];

        if (this.currentPlaylist === 'default') {
            ErrorHandler.notify(i18n.cannotDeleteDefault, null, 'warning');
            return;
        }

        const playlist = await this.db.getPlaylist(this.currentPlaylist);
        if (!playlist) return;

        if (!confirm(i18n.confirmDeletePlaylist + ' "' + playlist.name + '"?')) return;

        try {
            await this.db.deletePlaylist(this.currentPlaylist);
            this.currentPlaylist = 'default';
            await this.loadPlaylists();
            await this.loadPlaylist();
            ErrorHandler.notify(i18n.playlistDeleted, null, 'success');
        } catch (error) {
            ErrorHandler.notify('Error deleting playlist', error);
        }
    }

    // Audio Visualizer
    setupVisualizer() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;

            const source = this.audioContext.createMediaElementSource(this.audio);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        } catch (error) {
            console.error('Visualizer setup error:', error);
        }
    }

    drawVisualizer() {
        if (!this.visualizerActive || !this.analyser || !this.visualizerCanvas) return;

        try {
            const canvas = this.visualizerCanvas;
            const ctx = canvas.getContext('2d');
            if (!ctx) return; // Safety check

            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;

            this.analyser.getByteFrequencyData(this.dataArray);

        // Create dark gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        bgGradient.addColorStop(0, 'rgba(26, 26, 46, 0.95)');
        bgGradient.addColorStop(1, 'rgba(22, 33, 62, 0.95)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Symmetrical bar visualizer (mirror effect)
        const barCount = 64; // Use 64 bars for smooth appearance
        const barWidth = (WIDTH / barCount) * 0.8; // 80% width with gaps
        const gap = (WIDTH / barCount) * 0.2;

        for (let i = 0; i < barCount; i++) {
            // Sample data array (map 128 values to 64 bars)
            const dataIndex = Math.floor((i / barCount) * this.dataArray.length);
            const value = this.dataArray[dataIndex];

            // Smooth the values
            const barHeight = (value / 255) * (HEIGHT / 2) * 0.8;

            // X position
            const x = (i * (barWidth + gap)) + gap / 2;

            // Create gradient for each bar
            const gradient = ctx.createLinearGradient(0, HEIGHT / 2 - barHeight, 0, HEIGHT / 2 + barHeight);

            // Color based on frequency (low = purple, mid = blue, high = cyan)
            const hue = 240 + (i / barCount) * 60; // 240 (blue) to 300 (purple/magenta)
            const saturation = 70 + (value / 255) * 30;
            const lightness = 50 + (value / 255) * 20;

            gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`);
            gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness + 10}%, 1)`);
            gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`);

            ctx.fillStyle = gradient;

            // Add glow effect
            ctx.shadowBlur = 20;
            ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;

            // Draw top bar (above center)
            ctx.fillRect(x, HEIGHT / 2 - barHeight, barWidth, barHeight);

            // Draw bottom bar (below center - mirror)
            ctx.fillRect(x, HEIGHT / 2, barWidth, barHeight);
        }

        // Reset shadow
        ctx.shadowBlur = 0;

        // Draw center line
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
        ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, HEIGHT / 2);
            ctx.lineTo(WIDTH, HEIGHT / 2);
            ctx.stroke();

            requestAnimationFrame(() => this.drawVisualizer());
        } catch (error) {
            console.error('Visualizer drawing error:', error);
            // Stop visualizer on error to prevent infinite error loop
            this.visualizerActive = false;
        }
    }

    toggleVisualizer() {
        const i18n = I18N[this.lang];
        this.visualizerActive = !this.visualizerActive;

        if (this.visualizerActive) {
            // Setup visualizer on first use (lazy initialization)
            if (!this.audioContext) {
                // Warn mobile users about potential lock screen issues
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile && !this.visualizerWarningShown) {
                    this.visualizerWarningShown = true;
                    const warning = this.lang === 'ru'
                        ? '⚠️ Внимание: визуализатор может мешать воспроизведению на заблокированном экране. Если музыка останавливается при блокировке, отключите визуализатор и перезагрузите страницу.'
                        : '⚠️ Warning: visualizer may interfere with lock screen playback. If music stops when locking screen, disable visualizer and reload the page.';
                    ErrorHandler.notify(warning, null, 'warning');
                }
                this.setupVisualizer();
            }

            if (this.visualizerCanvas) {
                this.visualizerCanvas.style.display = 'block';
            }
            this.vinylDisc.style.display = 'none';
            if (this.albumArtImg) {
                this.albumArtImg.style.display = 'none';
            }
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            if (this.visualizerBtn) {
                this.visualizerBtn.classList.add('active');
            }
            this.drawVisualizer();
            ErrorHandler.notify(i18n.visualizerOn, null, 'info');
        } else {
            if (this.visualizerCanvas) {
                this.visualizerCanvas.style.display = 'none';
            }
            if (this.visualizerBtn) {
                this.visualizerBtn.classList.remove('active');
            }
            const currentTrack = this.playlist[this.currentIndex];
            if (currentTrack) {
                this.showAlbumArtOrVinyl(currentTrack);
            }
            ErrorHandler.notify(i18n.visualizerOff, null, 'info');
        }
    }

    // Lyrics Display
    toggleLyrics() {
        const i18n = I18N[this.lang];

        if (!this.lyricsPanel) return;

        this.lyricsVisible = !this.lyricsVisible;

        if (this.lyricsVisible) {
            this.displayLyrics();
            this.lyricsPanel.style.display = 'block';
            if (this.lyricsBtn) {
                this.lyricsBtn.classList.add('active');
            }
            ErrorHandler.notify(i18n.lyricsOn, null, 'info');
        } else {
            this.lyricsPanel.style.display = 'none';
            if (this.lyricsBtn) {
                this.lyricsBtn.classList.remove('active');
            }
            ErrorHandler.notify(i18n.lyricsOff, null, 'info');
        }
    }

    displayLyrics() {
        const i18n = I18N[this.lang];

        if (!this.lyricsContent) return;

        const track = this.playlist[this.currentIndex];
        if (!track || !track.lyrics) {
            this.lyricsContent.innerHTML = '<p class="lyrics-empty">' + i18n.noLyrics + '</p>';
            return;
        }

        const lyrics = track.lyrics;

        // Check if LRC format (synchronized lyrics)
        if (lyrics.includes('[') && lyrics.match(/\[\d{2}:\d{2}/)) {
            // LRC format with timestamps
            const lines = lyrics.split('\n').map(line => {
                const match = line.match(/\[(\d{2}):(\d{2})[:\.]?(\d{2})?\](.*)/);
                if (match) {
                    const minutes = parseInt(match[1]);
                    const seconds = parseInt(match[2]);
                    const centiseconds = match[3] ? parseInt(match[3]) : 0;
                    const time = minutes * 60 + seconds + centiseconds / 100;
                    const text = match[4].trim();
                    if (text) {
                        return `<p class="lyrics-line" data-time="${time}">${this.escapeHtml(text)}</p>`;
                    }
                }
                return '';
            }).filter(l => l).join('');

            this.lyricsContent.innerHTML = lines || '<p class="lyrics-empty">' + i18n.noLyrics + '</p>';
        } else {
            // Plain text lyrics
            const formatted = lyrics.split('\n').map(line =>
                line.trim() ? `<p>${this.escapeHtml(line)}</p>` : '<br>'
            ).join('');
            this.lyricsContent.innerHTML = formatted;
        }
    }

    syncLyrics() {
        if (!this.lyricsVisible || !this.lyricsContent) return;

        const currentTime = this.audio.currentTime;
        const lines = this.lyricsContent.querySelectorAll('.lyrics-line[data-time]');

        if (lines.length === 0) return;

        let activeLine = null;
        lines.forEach(line => {
            const time = parseFloat(line.dataset.time);
            line.classList.remove('active');
            if (time <= currentTime) {
                activeLine = line;
            }
        });

        if (activeLine) {
            activeLine.classList.add('active');
            // Smooth scroll to active line
            activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Theme System
    initTheme() {
        document.body.setAttribute('data-theme', this.currentTheme);
        if (this.themeToggle) {
            this.themeToggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        const i18n = I18N[this.lang];
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);

        if (this.themeToggle) {
            this.themeToggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }

        const message = this.currentTheme === 'light' ? i18n.themeLight : i18n.themeDark;
        ErrorHandler.notify(message, null, 'info');
    }

    // Chromecast / Google Cast Support
    initCast() {
        if (typeof cast === 'undefined' || !cast.framework) {
            console.log('Cast framework not available');
            return;
        }

        window['__onGCastApiAvailable'] = (isAvailable) => {
            if (isAvailable) {
                try {
                    const castContext = cast.framework.CastContext.getInstance();
                    castContext.setOptions({
                        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
                    });

                    // Show Cast button
                    if (this.castBtn) {
                        this.castBtn.style.display = 'flex';
                    }

                    // Listen for Cast state changes
                    castContext.addEventListener(
                        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
                        (event) => this.handleCastSessionChange(event)
                    );

                    console.log('Cast initialized successfully');
                } catch (error) {
                    console.error('Cast initialization error:', error);
                }
            }
        };
    }

    handleCastSessionChange(event) {
        const sessionState = event.sessionState;

        if (sessionState === cast.framework.SessionState.SESSION_STARTED) {
            this.castSession = cast.framework.CastContext.getInstance().getCurrentSession();
            this.isCasting = true;
            if (this.castBtn) {
                this.castBtn.classList.add('active');
            }
            ErrorHandler.notify('Connected to Cast device', null, 'success');

            // Load current track to Cast
            if (this.playlist[this.currentIndex]) {
                this.loadTrackToCast(this.playlist[this.currentIndex]);
            }
        } else if (sessionState === cast.framework.SessionState.SESSION_ENDED) {
            this.castSession = null;
            this.isCasting = false;
            if (this.castBtn) {
                this.castBtn.classList.remove('active');
            }
            ErrorHandler.notify('Disconnected from Cast device', null, 'info');
        }
    }

    async loadTrackToCast(track) {
        if (!this.castSession || !track) return;

        try {
            // Revoke previous Cast blob URL to prevent memory leak
            if (this.castBlobUrl) {
                URL.revokeObjectURL(this.castBlobUrl);
                this.castBlobUrl = null;
            }

            // Get track data
            const trackData = await this.db.getTrack(track.id);

            // Create blob URL for Cast (Cast needs a URL, not blob data)
            let fileBlob;
            if (trackData.arrayBuffer) {
                fileBlob = new Blob([trackData.arrayBuffer], { type: trackData.type });
            } else if (trackData.blob) {
                fileBlob = trackData.blob;
            } else if (trackData.file) {
                fileBlob = trackData.file;
            }

            const url = URL.createObjectURL(fileBlob);
            this.castBlobUrl = url; // Store for cleanup

            // Create media info for Cast
            const i18n = I18N[this.lang];
            const mediaInfo = new chrome.cast.media.MediaInfo(url, trackData.type);
            mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
            mediaInfo.metadata.title = track.title || track.name;
            mediaInfo.metadata.artist = track.artist || i18n.unknownArtist;
            mediaInfo.metadata.albumName = track.album || i18n.unknownAlbum;

            // Add album art if available
            if (track.albumArt) {
                mediaInfo.metadata.images = [new chrome.cast.Image(track.albumArt)];
            }

            // Load media to Cast device
            const request = new chrome.cast.media.LoadRequest(mediaInfo);
            request.autoplay = this.isPlaying;
            request.currentTime = this.audio.currentTime;

            await this.castSession.loadMedia(request);

            // Pause local playback
            this.audio.pause();

            console.log('Track loaded to Cast device');
        } catch (error) {
            console.error('Error loading track to Cast:', error);
            ErrorHandler.notify('Failed to cast track', error);
        }
    }

    toggleCast() {
        if (typeof cast === 'undefined' || !cast.framework) {
            ErrorHandler.notify('Cast not available', null, 'warning');
            return;
        }

        const castContext = cast.framework.CastContext.getInstance();

        if (this.isCasting) {
            // Stop casting
            castContext.endCurrentSession(true);
        } else {
            // Request Cast session
            castContext.requestSession().then(
                () => console.log('Cast session requested'),
                (error) => {
                    if (error !== chrome.cast.ErrorCode.CANCEL) {
                        ErrorHandler.notify('Cast request failed', null, 'error');
                    }
                }
            );
        }
    }
}

// Help Modal functionality
function initHelpModal() {
    const modal = document.getElementById('helpModal');
    const helpBtn = document.getElementById('helpBtn');
    const closeBtn = document.querySelector('.close');

    // Open modal when help button is clicked
    helpBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    // Close modal when X button is clicked
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Close modal when pressing ESC key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });
}

// Initialize the player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.player = new MusicPlayer();
    initHelpModal();
});
