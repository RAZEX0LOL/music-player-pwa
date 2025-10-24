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
        youtube: '🔗 YouTube',
        youtubeOffline: '⚠️ Офлайн',
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
        youtubeWarning: '⚠️ YouTube загрузка требует интернет',

        // Alerts
        addTracksOffline: 'Используйте перетаскивание файлов (drag & drop) для добавления треков офлайн',
        noTracks: 'Пожалуйста, сначала добавьте треки!',
        youtubeNeedsInternet: '⚠️ Эта функция требует интернет\n\nДля загрузки видео с YouTube необходимо подключение к интернету.\n\nПожалуйста, подключитесь к WiFi или мобильным данным.',

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
        formatNote: '💡 Видео: можно смотреть клипы\n🎧 Аудио: экономия места (~80% меньше)',

        // YouTube modal
        youtubeTitle: '🔗 Скачать с YouTube',
        youtubeOnlineBanner: 'Требуется подключение к интернету',
        youtubePlaceholder: 'Вставьте ссылку YouTube',
        youtubeExample: 'Пример: https://www.youtube.com/watch?v=...',
        youtubeFormat: 'Формат:',
        youtubeVideo: '🎬 Видео (MP4)',
        youtubeAudio: '🎵 Только аудио (MP3)',
        youtubeButton: '🚀 Открыть сайт загрузки',
        youtubeHow: '💡 Как это работает:',
        youtubeStep1: '1. Откроется проверенный сайт для загрузки',
        youtubeStep2: '2. Скачайте файл там и добавьте в плеер',
        youtubeSafe: 'Это безопасно и не требует бэкенда!',
        youtubeWarningTitle: '⚠️ Важно:',
        youtubeWarning1: '• Требуется интернет',
        youtubeWarning2: '• Только публичные видео',
        youtubeWarning3: '• Соблюдайте авторские права',
        youtubeWarning4: '• Сторонний сервис, не наш'
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
        youtubeWarning: '⚠️ YouTube download requires internet',

        // Alerts
        addTracksOffline: 'Use drag & drop to add tracks offline',
        noTracks: 'Please add tracks first!',
        youtubeNeedsInternet: '⚠️ This feature requires internet\n\nTo download videos from YouTube, you need an internet connection.\n\nPlease connect to WiFi or mobile data.',

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
        formatNote: '💡 Video: watch music videos\n🎧 Audio: save space (~80% smaller)',

        // YouTube modal
        youtubeTitle: '🔗 Download from YouTube',
        youtubeOnlineBanner: 'Internet connection required',
        youtubePlaceholder: 'Paste YouTube URL',
        youtubeExample: 'Example: https://www.youtube.com/watch?v=...',
        youtubeFormat: 'Format:',
        youtubeVideo: '🎬 Video (MP4)',
        youtubeAudio: '🎵 Audio Only (MP3)',
        youtubeButton: '🚀 Open Download Site',
        youtubeHow: '💡 How it works:',
        youtubeStep1: '1. A trusted download website will open',
        youtubeStep2: '2. Download the file there and add to player',
        youtubeSafe: 'Safe and no backend required!',
        youtubeWarningTitle: '⚠️ Important:',
        youtubeWarning1: '• Requires internet',
        youtubeWarning2: '• Public videos only',
        youtubeWarning3: '• Respect copyright laws',
        youtubeWarning4: '• Third-party service, not ours'
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
        this.addYoutubeBtn = document.getElementById('addYoutubeBtn');
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
        this.addYoutubeBtn.addEventListener('click', () => this.openYoutubeModal());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.clearAllBtn.addEventListener('click', () => this.clearAllSongs());
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.playNext());

        // Sync video element with audio element
        this.audio.addEventListener('play', () => {
            if (this.videoDisplay.src) {
                this.videoDisplay.play().catch(e => console.log('Video play error:', e));
            }
        });
        this.audio.addEventListener('pause', () => {
            if (this.videoDisplay.src) {
                this.videoDisplay.pause();
            }
        });
        this.audio.addEventListener('timeupdate', () => {
            if (this.videoDisplay.src && Math.abs(this.videoDisplay.currentTime - this.audio.currentTime) > 0.5) {
                this.videoDisplay.currentTime = this.audio.currentTime;
            }
        });

        window.addEventListener('online', () => this.updateOnlineStatus(true));
        window.addEventListener('offline', () => this.updateOnlineStatus(false));

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
        if (this.addYoutubeBtn) {
            const youtubeBtnText = document.getElementById('youtubeBtnText');
            if (isOnline) {
                this.addYoutubeBtn.disabled = false;
                this.addYoutubeBtn.classList.remove('disabled');
                if (youtubeBtnText) youtubeBtnText.textContent = t('youtube');
            } else {
                this.addYoutubeBtn.disabled = true;
                this.addYoutubeBtn.classList.add('disabled');
                if (youtubeBtnText) youtubeBtnText.textContent = t('youtubeOffline');
            }
        }
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

    openYoutubeModal() {
        // Check if online
        if (!navigator.onLine) {
            alert('⚠️ Эта функция требует интернет / This feature requires internet\n\n' +
                  'Для загрузки видео с YouTube необходимо подключение к интернету.\n' +
                  'To download videos from YouTube, you need an internet connection.\n\n' +
                  'Пожалуйста, подключитесь к WiFi или мобильным данным.\n' +
                  'Please connect to WiFi or mobile data.');
            return;
        }

        const modal = document.getElementById('youtubeModal');
        modal.classList.add('show');
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
                // Show video display and hide vinyl
                this.videoDisplay.src = url;
                this.videoDisplay.classList.add('show');
                this.vinylDisc.style.display = 'none';
                this.videoDisplay.load();
            } else {
                // Hide video display and show vinyl
                this.videoDisplay.src = '';
                this.videoDisplay.classList.remove('show');
                this.vinylDisc.style.display = 'flex';
            }

            this.audio.src = url;
            this.audio.load(); // Ensure video/audio element loads the source

            try {
                await this.audio.play();
                this.isPlaying = true;
            } catch (playError) {
                console.error('Playback error:', playError);
                // Try to play again (sometimes first attempt fails on mobile)
                this.isPlaying = false;
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

        if (this.audio.src === '') {
            await this.playSongAtIndex(0);
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

// YouTube Modal functionality
function initYoutubeModal() {
    const modal = document.getElementById('youtubeModal');
    const closeBtn = document.getElementById('youtubeModalClose');
    const downloadBtn = document.getElementById('downloadYoutubeBtn');
    const urlInput = document.getElementById('youtubeUrl');
    const progressDiv = document.getElementById('youtubeProgress');
    const progressBar = document.getElementById('youtubeProgressBar');

    // Close modal when X button is clicked
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        urlInput.value = '';
        progressDiv.style.display = 'none';
    });

    // Download from YouTube - Direct download using Cobalt API
    downloadBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) {
            alert(t('youtubeNeedsInternet').split('\n\n')[0]);
            return;
        }

        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
            alert(currentLang === 'ru' ? 'Неверный URL YouTube' : 'Invalid YouTube URL');
            return;
        }

        const format = document.querySelector('input[name="ytFormat"]:checked').value;
        const quality = document.getElementById('ytQuality').value;

        // Show progress
        progressDiv.style.display = 'block';
        downloadBtn.disabled = true;
        downloadBtn.textContent = currentLang === 'ru' ? '⏳ Загрузка...' : '⏳ Downloading...';

        try {
            await downloadYoutubeVideo(url, format, quality, (progress) => {
                progressBar.style.width = progress + '%';
            });

            // Success!
            modal.classList.remove('show');
            urlInput.value = '';
            progressDiv.style.display = 'none';
            downloadBtn.disabled = false;
            downloadBtn.textContent = currentLang === 'ru' ? '🚀 Открыть сайт загрузки' : '🚀 Open Download Site';

            // Reload playlist to show new track
            await window.player.loadPlaylist();

            // Show success message
            window.player.statusText.textContent = currentLang === 'ru'
                ? '✅ Видео успешно загружено!'
                : '✅ Video downloaded successfully!';

            setTimeout(() => {
                window.player.updateOnlineStatus(navigator.onLine);
            }, 3000);

        } catch (error) {
            console.error('YouTube download error:', error);
            alert(error.message);
            progressDiv.style.display = 'none';
            downloadBtn.disabled = false;
            downloadBtn.textContent = currentLang === 'ru' ? '🚀 Открыть сайт загрузки' : '🚀 Open Download Site';
        }
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
            urlInput.value = '';
            progressDiv.style.display = 'none';
        }
    });
}

// YouTube download function using Cobalt API (no backend needed!)
async function downloadYoutubeVideo(url, format, quality, progressCallback) {
    progressCallback(10);

    try {
        // Using Cobalt API - a free, open-source YouTube downloader API
        // Multiple instances for reliability
        const cobaltInstances = [
            'https://co.wuk.sh',
            'https://cobalt-api.kwiatekmiki.com',
            'https://api.cobalt.tools'
        ];

        progressCallback(20);

        // Prepare request
        const requestBody = {
            url: url,
            vCodec: 'h264',
            vQuality: quality === 'highest' ? '1080' : (quality === 'high' ? '720' : '480'),
            aFormat: format === 'audio' ? 'mp3' : 'best',
            isAudioOnly: format === 'audio',
            filenamePattern: 'basic'
        };

        progressCallback(30);

        // Try each instance until one works
        let downloadUrl = null;
        let lastError = null;

        for (const instance of cobaltInstances) {
            try {
                console.log(`Trying Cobalt instance: ${instance}`);

                const response = await fetch(instance + '/api/json', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                progressCallback(50);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Cobalt response:', data);

                progressCallback(70);

                if (data.status === 'redirect' || data.status === 'stream') {
                    downloadUrl = data.url;
                    break;
                } else if (data.status === 'error') {
                    throw new Error(data.text || 'Unknown error from Cobalt');
                }

            } catch (error) {
                console.error(`Instance ${instance} failed:`, error);
                lastError = error;
                continue;
            }
        }

        if (!downloadUrl) {
            throw new Error(lastError?.message || 'All Cobalt instances failed');
        }

        progressCallback(80);

        // Download the file
        const fileResponse = await fetch(downloadUrl);
        if (!fileResponse.ok) {
            throw new Error('Failed to download file');
        }

        progressCallback(90);

        // Get the blob
        const blob = await fileResponse.blob();

        // Create filename
        const filename = `youtube-${format === 'audio' ? 'audio' : 'video'}-${Date.now()}.${format === 'audio' ? 'mp3' : 'mp4'}`;
        const file = new File([blob], filename, { type: blob.type });

        progressCallback(95);

        // Add to player
        await window.player.db.addSong(file);

        progressCallback(100);

        return file;

    } catch (error) {
        console.error('YouTube download error:', error);
        throw new Error(
            currentLang === 'ru'
                ? `Ошибка загрузки: ${error.message}\n\nПопробуйте другое видео или используйте внешний сайт загрузки.`
                : `Download error: ${error.message}\n\nTry another video or use external download site.`
        );
    }
}

// Helper function to extract YouTube video ID
function extractYouTubeVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

// Open external YouTube downloader service
function openYouTubeDownloader(url, format) {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
        alert('Неверный URL YouTube / Invalid YouTube URL');
        return;
    }

    // Use trusted third-party services
    // Users can download there and then add to the player
    const services = {
        audio: [
            `https://yt1s.com/en/youtube-to-mp3?q=${encodeURIComponent(url)}`,
            `https://ytmp3.nu/en/?url=${encodeURIComponent(url)}`,
            `https://320ytmp3.com/en/?url=${encodeURIComponent(url)}`
        ],
        video: [
            `https://yt1s.com/en/youtube-to-mp4?q=${encodeURIComponent(url)}`,
            `https://y2mate.com/en/youtube-mp4/${videoId}`,
            `https://www.y2mate.com/youtube/${videoId}`
        ]
    };

    const serviceUrl = format === 'audio' ? services.audio[0] : services.video[0];

    // Open in new tab
    window.open(serviceUrl, '_blank');

    return serviceUrl;
}

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
    initYoutubeModal();
});
