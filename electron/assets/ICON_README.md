Using the provided logo for Windows taskbar/icon

I couldn't write the PNG binary directly from the chat attachment here. To finish the icon setup you have two options:

1) Quick (recommended): Re-upload the PNG file directly in the chat as a file (not just an image preview). I'll write it as `electron/assets/icon.png` and generate `electron/assets/icon.ico` for you.

2) Manual (works now): Paste the PNG file base64 (no data: header) into `electron/assets/icon.png.b64`, then run the included PowerShell script `electron\generate_icon.ps1`.

PowerShell example (once you have `icon.png.b64`):

Open PowerShell in the project root and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\electron\generate_icon.ps1
```

This requires ImageMagick (`magick`) to be installed and in PATH. The script will decode `icon.png.b64` to `electron/assets/icon.png` and produce `electron/assets/icon.ico` (multi-resolution).

After creating `electron/assets/icon.ico`, restart the Electron app. Windows will pick up the ICO when launching the packaged app; for development the `icon` path in `electron/main.js` currently points at `electron/assets/icon.png` (PNG works on some platforms but ICO is recommended for Windows taskbar/start menu).