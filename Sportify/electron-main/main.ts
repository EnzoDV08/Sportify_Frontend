import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.join(__dirname, '..');
const ELECTRON_DIST = path.join(APP_ROOT, 'dist-electron');
const RENDERER_DIST = path.join(APP_ROOT, 'dist-web');

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(ELECTRON_DIST, 'preload.js'),
      contextIsolation: true,
    }
  });

  win.maximize();
  win.webContents.openDevTools(); // remove this in final

  if (app.isPackaged) {
    // PRODUCTION: load the built index.html
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  } else {
    // DEVELOPMENT: use the Vite dev server
    win.loadURL('http://localhost:5173');
  }

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
