const MEDIA_EXTENSIONS = /\.(mp3|wav|ogg|m4a|flac|mp4|m4v|aac|wma|webm|mpeg)$/i;
const MEDIA_TYPES = ['audio/', 'video/mp4', 'video/x-m4v'];
const REPEAT_MODES = ['none', 'all', 'one'];

export function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

    const wholeSeconds = Math.floor(seconds);
    const minutes = Math.floor(wholeSeconds / 60);
    const remainder = wholeSeconds % 60;
    return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    if (bytes < 1024) return `${Math.floor(bytes)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getNextRepeatMode(currentMode) {
    const currentIndex = REPEAT_MODES.indexOf(currentMode);
    return REPEAT_MODES[(currentIndex + 1) % REPEAT_MODES.length];
}

export function getNextTrackIndex({
    currentIndex,
    trackCount,
    repeatMode = 'none',
    shuffle = false,
    random = Math.random
}) {
    if (!Number.isInteger(trackCount) || trackCount <= 0) return null;
    if (!Number.isInteger(currentIndex) || currentIndex < 0) return 0;
    if (repeatMode === 'one') return Math.min(currentIndex, trackCount - 1);

    if (shuffle) {
        const randomValue = Number(random());
        const normalized = Number.isFinite(randomValue)
            ? Math.min(Math.max(randomValue, 0), 0.999999999)
            : 0;
        return Math.floor(normalized * trackCount);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < trackCount) return nextIndex;
    return repeatMode === 'all' ? 0 : null;
}

export function validateMediaFile(file, maxFileSize) {
    if (!file || !Number.isFinite(maxFileSize) || maxFileSize <= 0) {
        return { valid: false, reason: 'unsupported' };
    }

    if (Number(file.size) > maxFileSize) {
        return { valid: false, reason: 'too-large' };
    }

    const type = typeof file.type === 'string' ? file.type.toLowerCase() : '';
    const name = typeof file.name === 'string' ? file.name : '';
    const allowedType = MEDIA_TYPES.some((allowed) => type.startsWith(allowed));
    const allowedExtension = MEDIA_EXTENSIONS.test(name);

    return allowedType || allowedExtension
        ? { valid: true, reason: null }
        : { valid: false, reason: 'unsupported' };
}
