Replace the Electron app icon

1) Place your image
- Put the image you attached into `electron/assets/` and name it `icon.png`.

2) For best Windows behavior convert to ICO
- Windows prefers `.ico` for the taskbar/start menu. Convert `icon.png` to `icon.ico` (multi-resolution) using a tool like:
  - https://convertio.co/png-ico/ (online)
  - ImageMagick locally: `magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico`

3) Recommended files in `electron/assets/`
- `icon.png` (PNG used by BrowserWindow during development)
- `icon.ico` (Windows proper icon used by installers or when packaging)

4) Packaging
- When you build/package the app (electron-builder / electron-packager), point the packager to `electron/assets/icon.ico` in the config so installers and exe have the correct icon.

5) Quick test (dev)
- Put `icon.png` in `electron/assets/` then run `npm run dev` and the window should use that image. For the taskbar icon on Windows you may need to restart the app after placing `icon.ico` and ensure `app.setAppUserModelId('com.friday.app')` is present (already added to `electron/main.js`).
