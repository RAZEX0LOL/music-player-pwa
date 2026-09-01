import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const requiredFiles = [
    'index.html',
    'styles.css',
    'app.js',
    'player-utils.js',
    'sw.js',
    'manifest.json',
    'icon.svg',
    'icons/icon-180.png',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'vendor/jsmediatags.min.js'
];

await Promise.all(requiredFiles.map((file) => access(new URL(file, root))));

const manifest = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8'));
assert.equal(manifest.display, 'standalone');
assert.ok(manifest.name);
assert.ok(manifest.start_url);
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 3);

const index = await readFile(new URL('index.html', root), 'utf8');
assert.match(index, /rel="manifest" href="\.\/manifest\.json"/);
assert.match(index, /<script type="module" src="\.\/app\.js"><\/script>/);

const serviceWorker = await readFile(new URL('sw.js', root), 'utf8');
for (const file of requiredFiles.filter((file) => file !== 'sw.js')) {
    assert.ok(serviceWorker.includes(`'./${file}'`), `${file} is missing from APP_SHELL`);
}

console.log(`Validated ${requiredFiles.length} PWA assets and manifest metadata.`);
