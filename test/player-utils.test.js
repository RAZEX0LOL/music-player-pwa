import assert from 'node:assert/strict';
import test from 'node:test';

import {
    formatBytes,
    formatDuration,
    getNextRepeatMode,
    getNextTrackIndex,
    validateMediaFile
} from '../player-utils.js';

test('formatDuration formats minutes and zero-pads seconds', () => {
    assert.equal(formatDuration(0), '0:00');
    assert.equal(formatDuration(65.9), '1:05');
    assert.equal(formatDuration(3600), '60:00');
});

test('formatDuration safely handles invalid values', () => {
    assert.equal(formatDuration(Number.NaN), '0:00');
    assert.equal(formatDuration(-1), '0:00');
});

test('formatBytes formats B, KB and MB values', () => {
    assert.equal(formatBytes(512), '512 B');
    assert.equal(formatBytes(1536), '1.5 KB');
    assert.equal(formatBytes(2 * 1024 * 1024), '2.0 MB');
});

test('formatBytes safely handles invalid values', () => {
    assert.equal(formatBytes(Number.NaN), '0 B');
    assert.equal(formatBytes(-1), '0 B');
});

test('getNextRepeatMode cycles through all supported modes', () => {
    assert.equal(getNextRepeatMode('none'), 'all');
    assert.equal(getNextRepeatMode('all'), 'one');
    assert.equal(getNextRepeatMode('one'), 'none');
    assert.equal(getNextRepeatMode('invalid'), 'none');
});

test('getNextTrackIndex starts the first track when nothing is selected', () => {
    assert.equal(getNextTrackIndex({ currentIndex: -1, trackCount: 3 }), 0);
});

test('getNextTrackIndex advances through the playlist', () => {
    assert.equal(getNextTrackIndex({ currentIndex: 0, trackCount: 3 }), 1);
});

test('getNextTrackIndex stops at the end by default', () => {
    assert.equal(getNextTrackIndex({ currentIndex: 2, trackCount: 3 }), null);
});

test('getNextTrackIndex wraps at the end in repeat-all mode', () => {
    assert.equal(getNextTrackIndex({ currentIndex: 2, trackCount: 3, repeatMode: 'all' }), 0);
});

test('getNextTrackIndex keeps the current track in repeat-one mode', () => {
    assert.equal(getNextTrackIndex({ currentIndex: 1, trackCount: 3, repeatMode: 'one' }), 1);
});

test('getNextTrackIndex uses injectable randomness for shuffle mode', () => {
    assert.equal(getNextTrackIndex({
        currentIndex: 1,
        trackCount: 4,
        shuffle: true,
        random: () => 0.75
    }), 3);
});

test('getNextTrackIndex returns null for an empty playlist', () => {
    assert.equal(getNextTrackIndex({ currentIndex: 0, trackCount: 0 }), null);
});

test('validateMediaFile accepts supported MIME types', () => {
    assert.deepEqual(
        validateMediaFile({ name: 'track.bin', type: 'audio/mpeg', size: 10 }, 100),
        { valid: true, reason: null }
    );
});

test('validateMediaFile accepts supported file extensions', () => {
    assert.deepEqual(
        validateMediaFile({ name: 'track.FLAC', type: '', size: 10 }, 100),
        { valid: true, reason: null }
    );
});

test('validateMediaFile rejects oversized and unsupported files', () => {
    assert.deepEqual(
        validateMediaFile({ name: 'track.mp3', type: 'audio/mpeg', size: 101 }, 100),
        { valid: false, reason: 'too-large' }
    );
    assert.deepEqual(
        validateMediaFile({ name: 'notes.txt', type: 'text/plain', size: 10 }, 100),
        { valid: false, reason: 'unsupported' }
    );
});
