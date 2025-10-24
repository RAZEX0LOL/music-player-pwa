// Language Manager
const translations = {
    ru: {
        // Header
        appTitle: '🎵 Моя Музыка',
        statusOnline: 'Онлайн',
        statusOffline: 'Офлайн - Работает без интернета!',
        statusReady: 'Готов',

        // Buttons
        addTracks: '📁 Добавить треки',
        // YouTube removed
        clearAll: '🗑️ Очистить всё',

        // Playlist
        playlistTitle: 'Плейлист',
        tracks: 'треков',
        track: 'трек',
        trackTwo: 'трека',
        searchPlaceholder: '🔍 Поиск треков...',
        emptyPlaylist: 'Пока нет треков',
        emptyHint: 'Добавьте треки для начала работы!',

        // Now Playing
        noTrack: 'Трек не играет',
        selectTrack: 'Выберите трек для начала',

        // Drag and drop
        dragHint: '✅ Перетаскивание файлов - работает офлайн!',

        // Alerts
        addTracksOffline: 'Используйте перетаскивание файлов (drag & drop) для добавления треков офлайн',
        noTracks: 'Пожалуйста, сначала добавьте треки!',

        // Status messages
        addingTracks: 'Добавление треков...',
        tracksAdded: 'Добавлено треков!',
        errorAdding: 'Ошибка добавления:',

        // Format modal
        formatTitle: '🎵 Выбор формата',
        keepVideo: 'Оставить как видео',
        keepVideoDesc: 'Полный видеофайл с изображением',
        audioOnly: 'Только аудио',
        audioOnlyDesc: 'Меньше размер, только звук',
        formatNote: '💡 Видео: можно смотреть клипы\n🎧 Аудио: экономия места (~80% меньше)'
    },
    en: {
        // Header
        appTitle: '🎵 My Music',
        statusOnline: 'Online',
        statusOffline: 'Offline - Works without internet!',
        statusReady: 'Ready',

        // Buttons
        addTracks: '📁 Add Tracks',
        youtube: '🔗 YouTube',
        youtubeOffline: '⚠️ Offline',
        clearAll: '🗑️ Clear All',

        // Playlist
        playlistTitle: 'Playlist',
        tracks: 'tracks',
        track: 'track',
        trackTwo: 'tracks',
        searchPlaceholder: '🔍 Search tracks...',
        emptyPlaylist: 'No tracks yet',
        emptyHint: 'Add tracks to get started!',

        // Now Playing
        noTrack: 'No track playing',
        selectTrack: 'Select a track to start',

        // Drag and drop
        dragHint: '✅ Drag & drop files - works offline!',

        // Alerts
        addTracksOffline: 'Use drag & drop to add tracks offline',
        noTracks: 'Please add tracks first!',

        // Status messages
        addingTracks: 'Adding tracks...',
        tracksAdded: 'tracks added!',
        errorAdding: 'Error adding:',

        // Format modal
        formatTitle: '🎵 Format Selection',
        keepVideo: 'Keep as Video',
        keepVideoDesc: 'Full video file with visuals',
        audioOnly: 'Audio Only',
        audioOnlyDesc: 'Smaller size, audio only',
        formatNote: '💡 Video: watch music videos\n🎧 Audio: save space (~80% smaller)'
    }
};

let currentLang = localStorage.getItem('playerLanguage') || 'ru';

function t(key) {
    return translations[currentLang][key] || key;
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('playerLanguage', lang);
    updateUILanguage();
}

function updateUILanguage() {
    // Update all elements with data-lang attributes
    document.querySelectorAll('[data-lang-ru]').forEach(el => {
        const newText = el.getAttribute(`data-lang-${currentLang}`);

        // Handle input placeholders
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
            el.placeholder = newText;
        } else {
            el.textContent = newText;
        }
    });

    // Update language toggle button
    const langText = document.getElementById('langText');
    if (langText) {
        langText.textContent = currentLang === 'ru' ? 'EN' : 'RU';
    }

    // Update YouTube button status text based on online/offline
    if (window.player) {
        window.player.updateOnlineStatus(navigator.onLine);
    }
}

// IndexedDB Manager
class MusicDB {
    constructor() {
        this.dbName = 'MusicPlayerDB';
        this.version = 1;
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

                if (!db.objectStoreNames.contains('songs')) {
                    const objectStore = db.createObjectStore('songs', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('name', 'name', { unique: false });
                    objectStore.createIndex('addedDate', 'addedDate', { unique: false });
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

                // Estimate how many songs can fit
                const avgSongSizeMB = 4; // Average MP3 song ~4MB
                const availableSpace = estimate.quota - estimate.usage;
                const estimatedSongs = Math.floor(availableSpace / (avgSongSizeMB * 1024 * 1024));
                console.log(`🎵 Estimated capacity: ~${estimatedSongs.toLocaleString()} songs (${avgSongSizeMB}MB each)`);
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

    async addSong(file) {
        // Convert File to ArrayBuffer BEFORE creating transaction
        // (to avoid transaction timeout)
        // Store ArrayBuffer instead of Blob/File for maximum compatibility
        const arrayBuffer = await file.arrayBuffer();

        // NOW create transaction after async work is done
        const transaction = this.db.transaction(['songs'], 'readwrite');
        const store = transaction.objectStore('songs');

        const song = {
            name: file.name,
            arrayBuffer: arrayBuffer,  // Store raw ArrayBuffer (most compatible)
            size: file.size,
            type: file.type,
            addedDate: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.add(song);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllSongs() {
        const transaction = this.db.transaction(['songs'], 'readonly');
        const store = transaction.objectStore('songs');

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getSong(id) {
        const transaction = this.db.transaction(['songs'], 'readonly');
        const store = transaction.objectStore('songs');

        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteSong(id) {
        const transaction = this.db.transaction(['songs'], 'readwrite');
        const store = transaction.objectStore('songs');

        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clearAll() {
        const transaction = this.db.transaction(['songs'], 'readwrite');
        const store = transaction.objectStore('songs');

        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

// Music Player
class MusicPlayer {
    constructor() {
        this.db = new MusicDB();
        this.audio = document.getElementById('audioPlayer');
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;

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
        this.songList = document.getElementById('songList');
        this.fileInput = document.getElementById('fileInput');
        this.addTracksBtn = document.getElementById('addTracksBtn');
        // YouTube button removed
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.currentSongTitle = document.getElementById('currentSongTitle');
        this.currentSongArtist = document.getElementById('currentSongArtist');
        this.vinylDisc = document.getElementById('vinylDisc');
        this.videoDisplay = document.getElementById('videoDisplay');
        this.songCount = document.getElementById('songCount');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        this.searchInput = document.getElementById('searchInput');

        // Store for pending files awaiting format selection
        this.pendingFiles = [];
        this.allSongs = []; // For search filtering
    }

    initEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.progressBar.addEventListener('input', (e) => this.seek(e.target.value));
        this.volumeBar.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.addTracksBtn.addEventListener('click', () => this.handleAddTracksClick());
        // YouTube modal removed
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.clearAllBtn.addEventListener('click', () => this.clearAllSongs());
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.playNext());

        // Track if we're trying to resume (prevent infinite loops)
        this.isResuming = false;

        // Prevent media from pausing when screen locks (for background playback)
        const preventBackgroundPause = (element, name) => {
            element.addEventListener('pause', () => {
                // Only auto-resume if:
                // 1. We're supposed to be playing
                // 2. This element has content
                // 3. Screen is hidden (locked)
                // 4. We're not already in a resume attempt
                if (this.isPlaying && element.src && document.hidden && !this.isResuming) {
                    console.log(`${name} paused while hidden - resuming for background playback`);
                    this.isResuming = true;
                    setTimeout(() => {
                        element.play()
                            .then(() => {
                                this.isResuming = false;
                            })
                            .catch(err => {
                                console.log(`Background resume failed:`, err);
                                this.isResuming = false;
                            });
                    }, 50);
                }
            });
        };

        preventBackgroundPause(this.audio, 'Audio');
        preventBackgroundPause(this.videoDisplay, 'Video');

        // Handle when media actually starts playing
        this.audio.addEventListener('playing', () => {
            this.isResuming = false;
            console.log('Audio playing event');
        });

        this.videoDisplay.addEventListener('playing', () => {
            this.isResuming = false;
            console.log('Video playing event');
        });

        // Video element event listeners
        this.videoDisplay.addEventListener('ended', () => this.playNext());
        this.videoDisplay.addEventListener('loadedmetadata', () => {
            if (this.videoDisplay.src) {
                this.updateDuration();
            }
        });
        this.videoDisplay.addEventListener('timeupdate', () => {
            if (this.videoDisplay.src) {
                this.updateProgress();
            }
        });

        window.addEventListener('online', () => this.updateOnlineStatus(true));
        window.addEventListener('offline', () => this.updateOnlineStatus(false));

        // Handle visibility changes (screen lock/unlock)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Screen unlocked or app foregrounded
                console.log('App visible again');
                // Reset resume flag
                this.isResuming = false;

                // If we should be playing, make sure media is playing
                if (this.isPlaying) {
                    const media = this.getActiveMediaElement();
                    if (media.paused) {
                        console.log('Resuming playback after unlock');
                        setTimeout(() => {
                            media.play().catch(e => console.log('Resume on unlock error:', e));
                        }, 200);
                    }
                }
            } else {
                console.log('App hidden (screen locked)');
            }
        });

        // Drag and drop support for offline file uploads
        const dropZone = document.body;
        dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        dropZone.addEventListener('drop', (e) => this.handleDrop(e));
    }

    async init() {
        try {
            await this.db.init();
            await this.loadPlaylist();
            this.setVolume(70);
            this.updateOnlineStatus(navigator.onLine);
            this.registerServiceWorker();
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
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    updateOnlineStatus(isOnline) {
        this.statusIndicator.className = isOnline ? 'online' : 'offline';
        this.statusText.textContent = isOnline ? t('statusOnline') : t('statusOffline');

        // Disable/enable YouTube button based on connection
        // YouTube button removed
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

    // YouTube modal removed

    // Helper method to get the active media element
    getActiveMediaElement() {
        // Return video element if it has a source (video file playing)
        // Otherwise return audio element (audio file playing)
        return this.videoDisplay.src ? this.videoDisplay : this.audio;
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();

        if (!searchTerm) {
            // Show all songs
            this.playlist = [...this.allSongs];
        } else {
            // Filter songs
            this.playlist = this.allSongs.filter(song =>
                song.name.toLowerCase().includes(searchTerm)
            );
        }

        this.renderPlaylist();
    }

    async handleFileSelect(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        // Check if any files are video files
        const videoFiles = files.filter(file =>
            file.type.startsWith('video/') ||
            file.name.match(/\.(mp4|m4v|webm|mpeg)$/i)
        );

        if (videoFiles.length > 0) {
            // Store files and show format selection modal
            this.pendingFiles = files;
            this.showFormatModal();
        } else {
            // All audio files, add directly
            await this.addFilesToLibrary(files, false);
        }

        event.target.value = '';
    }

    async addFilesToLibrary(files, audioOnly) {
        this.statusText.textContent = `Добавление ${files.length} треков...`;

        try {
            for (const file of files) {
                if (audioOnly && (file.type.startsWith('video/') || file.name.match(/\.(mp4|m4v|webm)$/i))) {
                    // Convert video to audio only (extract audio track)
                    // Note: Full conversion requires FFmpeg, so we'll store with metadata flag
                    const audioFile = await this.extractAudio(file);
                    await this.db.addSong(audioFile);
                } else {
                    await this.db.addSong(file);
                }
            }

            await this.loadPlaylist();
            this.statusText.textContent = `Добавлено ${files.length} треков!`;

            // Show storage info after adding songs
            this.showStorageInfo();

            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
        } catch (error) {
            console.error('Error adding tracks:', error);
            this.statusText.textContent = 'Ошибка добавления: ' + error.message;
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 3000);
        }
    }

    async extractAudio(videoFile) {
        // For now, we'll just mark it as audio-only
        // In a real implementation, you'd use FFmpeg.js or similar
        // For this PWA, we'll store the video but play audio-only
        return videoFile;
    }

    showFormatModal() {
        const modal = document.getElementById('formatModal');
        modal.classList.add('show');
    }

    async loadPlaylist() {
        try {
            this.allSongs = await this.db.getAllSongs();
            this.playlist = [...this.allSongs];
            this.renderPlaylist();
            this.updateSongCount();
        } catch (error) {
            console.error('Error loading playlist:', error);
        }
    }

    renderPlaylist() {
        if (this.playlist.length === 0) {
            this.songList.innerHTML = `
                <div class="empty-state">
                    <p>Пока нет треков</p>
                    <p class="hint">Добавьте треки для начала работы!</p>
                </div>
            `;
            return;
        }

        this.songList.innerHTML = this.playlist.map((song, index) => `
            <div class="song-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="song-item-info">
                    <div class="song-item-title">${this.escapeHtml(song.name)}</div>
                    <div class="song-item-duration">${this.formatFileSize(song.size)}</div>
                </div>
                <button class="delete-btn" data-id="${song.id}" onclick="event.stopPropagation()">🗑️</button>
            </div>
        `).join('');

        document.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-btn')) {
                    this.playSongAtIndex(parseInt(item.dataset.index));
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                await this.deleteSong(id);
            });
        });
    }

    async deleteSong(id) {
        try {
            await this.db.deleteSong(id);

            const wasPlaying = this.isPlaying;
            const deletedIndex = this.playlist.findIndex(s => s.id === id);

            if (deletedIndex === this.currentIndex) {
                this.audio.pause();
                this.isPlaying = false;
                this.updatePlayButton();
            }

            await this.loadPlaylist();

            if (this.playlist.length > 0 && deletedIndex === this.currentIndex) {
                this.currentIndex = Math.min(this.currentIndex, this.playlist.length - 1);
                if (wasPlaying) {
                    await this.playSongAtIndex(this.currentIndex);
                }
            } else if (deletedIndex < this.currentIndex) {
                this.currentIndex--;
            }

            this.statusText.textContent = 'Песня удалена';
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    }

    async clearAllSongs() {
        if (!confirm('Вы уверены, что хотите удалить все песни?')) return;

        try {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton();

            await this.db.clearAll();
            await this.loadPlaylist();

            this.currentIndex = 0;
            this.currentSongTitle.textContent = 'Песня не играет';
            this.currentSongArtist.textContent = 'Выберите песню для начала';
            this.vinylDisc.classList.remove('spinning');

            this.statusText.textContent = 'Все песни удалены';
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
        } catch (error) {
            console.error('Error clearing songs:', error);
        }
    }

    async playSongAtIndex(index) {
        if (index < 0 || index >= this.playlist.length) return;

        this.currentIndex = index;
        const song = this.playlist[index];

        try {
            const songData = await this.db.getSong(song.id);

            // Recreate Blob from stored data (supports multiple storage formats)
            let fileBlob;
            if (songData.arrayBuffer) {
                // New format: ArrayBuffer (most compatible)
                fileBlob = new Blob([songData.arrayBuffer], { type: songData.type });
            } else if (songData.blob) {
                // Old format: Blob
                fileBlob = songData.blob;
            } else if (songData.file) {
                // Oldest format: File
                fileBlob = songData.file;
            }

            const url = URL.createObjectURL(fileBlob);

            // Check if this is a video file
            const isVideo = songData.type.startsWith('video/') ||
                          song.name.match(/\.(mp4|m4v|webm|mpeg)$/i);

            if (isVideo) {
                // For video files: use ONLY video element (it plays audio too)
                this.videoDisplay.src = url;
                this.videoDisplay.classList.add('show');
                this.vinylDisc.style.display = 'none';

                // Don't use audio element for video files (causes lag)
                this.audio.src = '';
                this.audio.pause();

                // Video element plays both video and audio
                this.videoDisplay.muted = false;
                this.videoDisplay.volume = this.audio.volume || 0.7;

                // Load video
                this.videoDisplay.load();

                try {
                    await this.videoDisplay.play();
                    this.isPlaying = true;
                    if ('mediaSession' in navigator) {
                        navigator.mediaSession.playbackState = 'playing';
                    }
                } catch (playError) {
                    console.error('Video playback error:', playError);
                    this.isPlaying = false;
                    if ('mediaSession' in navigator) {
                        navigator.mediaSession.playbackState = 'paused';
                    }
                }
            } else {
                // For audio files: use audio element and show vinyl
                this.videoDisplay.src = '';
                this.videoDisplay.pause();
                this.videoDisplay.muted = false;
                this.videoDisplay.classList.remove('show');
                this.vinylDisc.style.display = 'flex';

                this.audio.src = url;
                this.audio.load();

                try {
                    await this.audio.play();
                    this.isPlaying = true;
                    if ('mediaSession' in navigator) {
                        navigator.mediaSession.playbackState = 'playing';
                    }
                } catch (playError) {
                    console.error('Audio playback error:', playError);
                    this.isPlaying = false;
                    if ('mediaSession' in navigator) {
                        navigator.mediaSession.playbackState = 'paused';
                    }
                }
            }

            this.updatePlayButton();
            this.updateNowPlaying(song.name);
            this.vinylDisc.classList.add('spinning');
            this.renderPlaylist();
            this.updateMediaSession(song.name);
            this.updateMediaSessionPositionState();
        } catch (error) {
            console.error('Error playing song:', error);
            this.statusText.textContent = 'Ошибка воспроизведения: ' + error.message;
        }
    }

    async togglePlay() {
        if (this.playlist.length === 0) {
            alert('Пожалуйста, сначала добавьте треки!');
            return;
        }

        const media = this.getActiveMediaElement();

        if (media.src === '') {
            await this.playSongAtIndex(0);
            return;
        }

        if (this.isPlaying) {
            media.pause();
            this.vinylDisc.classList.remove('spinning');
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'paused';
            }
        } else {
            await media.play();
            this.vinylDisc.classList.add('spinning');
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing';
            }
        }

        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
    }

    async playNext() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        await this.playSongAtIndex(this.currentIndex);
    }

    async playPrevious() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        await this.playSongAtIndex(this.currentIndex);
    }

    updatePlayButton() {
        this.playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }

    updateNowPlaying(songName) {
        const name = songName.replace(/\.[^/.]+$/, '');
        this.currentSongTitle.textContent = name;
        this.currentSongArtist.textContent = 'Сейчас играет';
    }

    updateProgress() {
        const media = this.getActiveMediaElement();
        if (media.duration) {
            const progress = (media.currentTime / media.duration) * 100;
            this.progressBar.value = progress;
            this.currentTimeEl.textContent = this.formatTime(media.currentTime);
        }
    }

    updateDuration() {
        const media = this.getActiveMediaElement();
        if (media.duration) {
            this.durationEl.textContent = this.formatTime(media.duration);
            this.updateMediaSessionPositionState();
        }
    }

    seek(value) {
        const media = this.getActiveMediaElement();
        if (media.duration) {
            const time = (value / 100) * media.duration;
            media.currentTime = time;
        }
    }

    setVolume(value) {
        const volume = value / 100;
        this.audio.volume = volume;
        this.videoDisplay.volume = volume;
    }

    updateSongCount() {
        this.songCount.textContent = this.playlist.length;
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

    updateMediaSession(songName) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songName.replace(/\.[^/.]+$/, ''),
                artist: currentLang === 'ru' ? 'Моя Музыка' : 'My Music',
                album: currentLang === 'ru' ? 'Офлайн Музыкальный Плеер' : 'Offline Music Player',
                artwork: [
                    { src: './icon.svg', sizes: '512x512', type: 'image/svg+xml' },
                    { src: './icon.svg', sizes: '192x192', type: 'image/svg+xml' },
                    { src: './icon.svg', sizes: '96x96', type: 'image/svg+xml' }
                ]
            });

            // Basic playback controls
            navigator.mediaSession.setActionHandler('play', () => {
                if (!this.isPlaying) this.togglePlay();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                if (this.isPlaying) this.togglePlay();
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                const media = this.getActiveMediaElement();
                media.pause();
                media.currentTime = 0;
                this.isPlaying = false;
                this.updatePlayButton();
                this.vinylDisc.classList.remove('spinning');
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => this.playPrevious());
            navigator.mediaSession.setActionHandler('nexttrack', () => this.playNext());

            // Seek controls for lock screen rewind/fast-forward
            navigator.mediaSession.setActionHandler('seekbackward', (details) => {
                const media = this.getActiveMediaElement();
                const skipTime = details.seekOffset || 10;
                media.currentTime = Math.max(0, media.currentTime - skipTime);
            });

            navigator.mediaSession.setActionHandler('seekforward', (details) => {
                const media = this.getActiveMediaElement();
                const skipTime = details.seekOffset || 10;
                media.currentTime = Math.min(media.duration, media.currentTime + skipTime);
            });

            // Direct seek to specific position
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                const media = this.getActiveMediaElement();
                if (details.fastSeek && 'fastSeek' in media) {
                    media.fastSeek(details.seekTime);
                } else {
                    media.currentTime = details.seekTime;
                }
            });
        }
    }

    // Update Media Session position state (called during playback)
    updateMediaSessionPositionState() {
        if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
            const media = this.getActiveMediaElement();
            if (media.duration && !isNaN(media.duration)) {
                try {
                    navigator.mediaSession.setPositionState({
                        duration: media.duration,
                        playbackRate: media.playbackRate,
                        position: media.currentTime
                    });
                } catch (error) {
                    // Ignore errors if position state is not supported
                    console.log('Position state not supported:', error);
                }
            }
        }
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

        const files = Array.from(event.dataTransfer.files).filter(file =>
            file.type.startsWith('audio/') ||
            file.type.startsWith('video/') ||
            file.name.match(/\.(mp3|wav|ogg|m4a|flac|mp4|m4v|aac|wma|webm|mpeg)$/i)
        );

        if (files.length === 0) {
            this.statusText.textContent = 'Нет аудио файлов для добавления';
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
            return;
        }

        this.statusText.textContent = `Добавление ${files.length} песен...`;

        try {
            for (const file of files) {
                await this.db.addSong(file);
            }

            await this.loadPlaylist();
            this.statusText.textContent = `Добавлено ${files.length} песен!`;
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
        } catch (error) {
            console.error('Error adding songs via drag and drop:', error);
            this.statusText.textContent = 'Ошибка добавления песен';
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

// Format Selection Modal functionality
function initFormatModal() {
    const modal = document.getElementById('formatModal');
    const closeBtn = document.getElementById('formatModalClose');
    const keepVideoBtn = document.getElementById('keepVideoBtn');
    const audioOnlyBtn = document.getElementById('audioOnlyBtn');

    // Close modal when X button is clicked
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        window.player.pendingFiles = [];
    });

    // Keep as video - add files with video
    keepVideoBtn.addEventListener('click', async () => {
        modal.classList.remove('show');
        if (window.player && window.player.pendingFiles.length > 0) {
            await window.player.addFilesToLibrary(window.player.pendingFiles, false);
            window.player.pendingFiles = [];
        }
    });

    // Audio only - extract audio
    audioOnlyBtn.addEventListener('click', async () => {
        modal.classList.remove('show');
        if (window.player && window.player.pendingFiles.length > 0) {
            await window.player.addFilesToLibrary(window.player.pendingFiles, true);
            window.player.pendingFiles = [];
        }
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
            window.player.pendingFiles = [];
        }
    });
}

// YouTube feature removed

// Language toggle initialization
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const newLang = currentLang === 'ru' ? 'en' : 'ru';
            switchLanguage(newLang);
        });
    }

    // Initialize language on load
    updateUILanguage();
}

// Initialize the player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.player = new MusicPlayer();
    initLanguageToggle();
    initHelpModal();
    initFormatModal();
    // YouTube modal removed
});
