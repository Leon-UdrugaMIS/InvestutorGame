Investutor desktop build

This project includes a browser-based game and an Android wrapper.

To run the desktop version:
1. Open index.html in a browser, or use a local web server.
2. For a Windows EXE, use Electron Packager or Electron Builder from a Node project.

Example:
- npm install electron --save-dev
- npm install electron-packager --save-dev
- npx electron-packager . Investutor --platform=win32 --arch=x64 --out=dist

This creates a Windows EXE package from the game folder.
