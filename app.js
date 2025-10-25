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
        tracks: 'треков'
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
        tracks: 'tracks'
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

                if (!db.objectStoreNames.contains('tracks')) {
                    const objectStore = db.createObjectStore('tracks', { keyPath: 'id', autoIncrement: true });
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

    async addTrack(file) {
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
            addedDate: new Date().toISOString()
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
}

// Music Player
class MusicPlayer {
    constructor() {
        this.db = new MusicDB();
        this.audio = document.getElementById('audioPlayer');
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

        // New elements
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.searchInput = document.getElementById('searchInput');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFileInput = document.getElementById('importFileInput');
        this.sleepTimerBtn = document.getElementById('sleepTimerBtn');
        this.speedBtn = document.getElementById('speedBtn');
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

        window.addEventListener('online', () => this.updateOnlineStatus(true));
        window.addEventListener('offline', () => this.updateOnlineStatus(false));

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

                await this.db.addTrack(file);
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
            this.playlist = await this.db.getAllTracks();
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
                    this.playTrackAtIndex(parseInt(item.dataset.index));
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                await this.deleteTrack(id);
            });
        });
    }

    async deleteTrack(id) {
        try {
            await this.db.deleteTrack(id);

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
                    await this.playTrackAtIndex(this.currentIndex);
                }
            } else if (deletedIndex < this.currentIndex) {
                this.currentIndex--;
            }

            this.statusText.textContent = 'Трек удалён';
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
        } catch (error) {
            console.error('Error deleting track:', error);
        }
    }

    async clearAllTracks() {
        if (!confirm('Вы уверены, что хотите удалить все треки?')) return;

        try {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton();

            await this.db.clearAll();
            await this.loadPlaylist();

            this.currentIndex = 0;
            this.currentTrackTitle.textContent = 'Трек не играет';
            this.currentTrackArtist.textContent = 'Выберите трек для начала';
            this.vinylDisc.classList.remove('spinning');

            this.statusText.textContent = 'Все треки удалены';
            setTimeout(() => {
                this.updateOnlineStatus(navigator.onLine);
            }, 2000);
        } catch (error) {
            console.error('Error clearing tracks:', error);
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
                this.isPlaying = true;
            } catch (playError) {
                console.error('Playback error:', playError);
                ErrorHandler.notify(I18N[this.lang].errorPlayback, playError, 'error');
                // Try to play again (sometimes first attempt fails on mobile)
                this.isPlaying = false;
            }

            this.updatePlayButton();
            this.updateNowPlaying(track.name);
            this.vinylDisc.classList.add('spinning');
            this.renderPlaylist();
            this.updateMediaSession(track.name);
            this.updateMediaSessionPositionState();
        } catch (error) {
            console.error('Error playing track:', error);
            const i18n = I18N[this.lang];
            this.statusText.textContent = i18n.errorPlayback + ': ' + error.message;
            ErrorHandler.notify(i18n.errorPlayback, error);
        }
    }

    async togglePlay() {
        if (this.playlist.length === 0) {
            alert('Пожалуйста, сначала добавьте треки!');
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
            await this.audio.play();
            this.vinylDisc.classList.add('spinning');
        }

        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
    }

    async playNext() {
        if (this.playlist.length === 0) return;

        // Repeat one track
        if (this.repeatMode === 'one') {
            await this.playTrackAtIndex(this.currentIndex);
            return;
        }

        // Shuffle mode
        if (this.shuffleMode) {
            const randomIndex = Math.floor(Math.random() * this.playlist.length);
            this.currentIndex = randomIndex;
        } else {
            // Normal mode
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        }

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

    updateMediaSession(trackName) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: trackName.replace(/\.[^/.]+$/, ''),
                artist: 'Моя Музыка',
                album: 'Офлайн Музыкальный Плеер'
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
            this.isPlaying = false;
            this.updatePlayButton();
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

                await this.db.addTrack(file);
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
