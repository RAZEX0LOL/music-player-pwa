// IndexedDB Manager
class MusicDB {
    constructor() {
        this.dbName = 'MusicPlayerDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
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

    async addSong(file) {
        const transaction = this.db.transaction(['songs'], 'readwrite');
        const store = transaction.objectStore('songs');

        const song = {
            name: file.name,
            file: file,
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
        this.addSongsBtn = document.getElementById('addSongsBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.currentSongTitle = document.getElementById('currentSongTitle');
        this.currentSongArtist = document.getElementById('currentSongArtist');
        this.vinylDisc = document.getElementById('vinylDisc');
        this.songCount = document.getElementById('songCount');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
    }

    initEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.progressBar.addEventListener('input', (e) => this.seek(e.target.value));
        this.volumeBar.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.addSongsBtn.addEventListener('click', () => this.handleAddSongsClick());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.clearAllBtn.addEventListener('click', () => this.clearAllSongs());

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.playNext());

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
        this.statusText.textContent = isOnline ? 'Онлайн' : 'Офлайн - Работает без интернета!';
    }

    handleAddSongsClick() {
        // Try to open file picker
        // Note: iOS Safari may block this in offline PWA mode
        // In that case, users can use drag-and-drop instead
        try {
            this.fileInput.click();
        } catch (error) {
            console.error('File picker error:', error);
            alert('Используйте перетаскивание файлов (drag & drop) для добавления песен офлайн');
        }
    }

    async handleFileSelect(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

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
            console.error('Error adding songs:', error);
            this.statusText.textContent = 'Ошибка добавления песен';
        }

        event.target.value = '';
    }

    async loadPlaylist() {
        try {
            this.playlist = await this.db.getAllSongs();
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
                    <p>Пока нет песен</p>
                    <p class="hint">Добавьте песни для начала работы!</p>
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
            const url = URL.createObjectURL(songData.file);

            this.audio.src = url;
            await this.audio.play();

            this.isPlaying = true;
            this.updatePlayButton();
            this.updateNowPlaying(song.name);
            this.vinylDisc.classList.add('spinning');
            this.renderPlaylist();
            this.updateMediaSession(song.name);
            this.updateMediaSessionPositionState();
        } catch (error) {
            console.error('Error playing song:', error);
            this.statusText.textContent = 'Ошибка воспроизведения';
        }
    }

    async togglePlay() {
        if (this.playlist.length === 0) {
            alert('Пожалуйста, сначала добавьте песни!');
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

// Initialize the player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.player = new MusicPlayer();
});
