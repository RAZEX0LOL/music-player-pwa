# Changelog

## Version 2.0.0 - 2025-10-26

### 🔴 Critical Fixes

- **Fixed memory leak** - Blob URLs are now properly revoked after use
- **Added service worker update detection** - Users are notified when updates are available
- **Implemented full accessibility support** - Added ARIA labels, focus states, and keyboard navigation

### ✨ New Features

- **Keyboard shortcuts** - Full keyboard control (Space, Arrows, M, S, R)
- **Shuffle mode** - Random track playback
- **Repeat modes** - None, All, or One track
- **Search functionality** - Real-time playlist filtering
- **Playlist export/import** - Backup playlists as JSON
- **Sleep timer** - Auto-stop playback after specified time
- **Playback speed control** - 0.5x to 2x speed
- **Toast notifications** - Beautiful, non-intrusive feedback system

### 🎨 UI/UX Improvements

- **Search bar** - Quick track search with visual feedback
- **Control buttons** - Shuffle, repeat, speed, timer, export, import
- **Better focus indicators** - Clear visual feedback for keyboard navigation
- **Improved error messages** - User-friendly notifications
- **Progress indicators** - Shows upload progress with percentages

### 🌐 Internationalization

- **English language support** - Full translation alongside Russian
- **Auto-detection** - Uses browser language preference
- **Easy extensibility** - Simple to add more languages

### 🛠️ Technical Improvements

- **File validation** - Size and type checking before upload
- **Better error handling** - Try-catch blocks throughout
- **Firefox compatibility** - Backdrop-filter fallbacks
- **Enhanced icon generator** - iOS-ready PNG icon creation
- **Service worker v8** - Updated cache version

### 📋 Code Quality

- **Modular error handling** - ErrorHandler class
- **Centralized strings** - I18N object for translations
- **Improved comments** - Better documentation
- **Consistent styling** - Unified code formatting

### 🔧 Developer Tools

- **Enhanced create-icons.html** - Generate all required icon sizes
- **Comprehensive documentation** - IMPROVEMENTS.md with full details
- **Syntax validation** - No errors in code

---

## How to Update

1. **For existing users**: The service worker will detect the update automatically
2. **For developers**:
   - Pull latest changes
   - Open `create-icons.html` to generate PNG icons
   - Update `manifest.json` if using new icons
   - Deploy to your hosting service

## Breaking Changes

None - fully backward compatible!

## Testing Checklist

- [x] Memory leak fixed
- [x] Service worker updates work
- [x] All keyboard shortcuts functional
- [x] Shuffle and repeat working
- [x] Search filters correctly
- [x] Export/import successful
- [x] Sleep timer triggers
- [x] Playback speed changes
- [x] Toast notifications display
- [x] Accessibility compliant
- [x] Firefox compatibility
- [x] No JavaScript errors
- [x] Icon generator works

## Statistics

- **Files Modified**: 5 (app.js, index.html, styles.css, sw.js, create-icons.html)
- **Lines Added**: ~700
- **New Features**: 8
- **Bug Fixes**: 3 critical
- **Improvements**: 10+

---

**All improvements completed and tested! 🎉**
