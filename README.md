# Firefox YouTube Saver

A Firefox extension that allows you to save YouTube videos to an easily accessible watchlist. Never lose track of videos you want to watch later!

## Features

- Save YouTube videos to a personal watchlist
- Access your watchlist from the browser toolbar with a single click
- Save videos via toolbar button or right-click context menu
- Receive notifications when videos are successfully saved
- Remove videos from your watchlist when you're done
- Open saved videos directly from the extension popup

## Installation

1. Clone or download this repository.
2. Open Firefox and navigate to `about:debugging`.
3. Click on "This Firefox" in the sidebar.
4. Click on "Load Temporary Add-on".
5. Select the `manifest.json` file from the downloaded repository.

## Usage

### Saving Videos
There are two ways to save a YouTube video:

1. **Using the toolbar button:**
   - Navigate to a YouTube video
   - Click on the extension icon in the toolbar
   - Click "Add Current Video" to save it to your watchlist
   - You'll see a notification confirming the video was saved

2. **Using the context menu:**
   - Right-click anywhere on a YouTube video page
   - Select "Save this YouTube video" from the context menu
   - The video will be saved to your watchlist

### Managing Your Watchlist
- Click the extension icon in the toolbar to view your saved videos
- Click "Watch" on any saved video to open it in a new tab
- Click "Remove" to delete a video from your watchlist

## Development

To develop and test changes to the extension:

1. Make your code changes in the repository
2. Go to `about:debugging` in Firefox
3. Click on "This Firefox" in the sidebar
4. If you've already loaded the extension, click "Reload" next to it
5. If not, follow the installation steps above to load it

### Project Structure

- `manifest.json` - Extension configuration
- `popup/` - Contains the UI for the extension popup
- `content_scripts/` - Contains scripts that run on YouTube pages
- `background_scripts/` - Contains background scripts for the extension
- `_locales/` - Contains localization files
- `icons/` - Contains extension icons

## Packaging for Distribution

To package the extension for distribution:

1. Zip the contents of the repository (excluding any development files like `.git`)
2. Rename the zip file to have a `.xpi` extension
3. You can then distribute this file or submit it to the Firefox Add-ons store

For official distribution through Mozilla Add-ons:
1. Create an account on [Mozilla Add-ons](https://addons.mozilla.org/developers/)
2. Follow the submission guidelines to upload your extension

## Screenshots

*[Add screenshots of the extension here, showing:]*
- *The extension popup with saved videos*
- *The context menu option on a YouTube page*
- *The notification when a video is saved*

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
