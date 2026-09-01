# Security Policy

## Supported version

Security fixes are applied to the latest version on the `master` branch.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting feature when it is available. Otherwise, contact the maintainer through the email address listed on the [GitHub profile](https://github.com/RAZEX0LOL) and avoid opening a public issue with exploit details.

Include the affected browser, reproduction steps, expected impact, and any suggested mitigation. Please do not attach personal audio files or exported playlists.

## Data model

The application has no backend and does not upload a user's library. Audio blobs and playlist metadata are stored locally in IndexedDB. Reports involving browser storage, imported-file handling, Service Worker caching, or cross-site scripting are in scope.
