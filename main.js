const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs/promises');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 800,
    icon: path.join(__dirname, 'images', 'galaxia.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  const userDataDir = app.getPath('userData');
  const saveFile = path.join(userDataDir, 'save.json');

  ipcMain.handle('save-data', async (_evt, data) => {
    await fs.mkdir(userDataDir, { recursive: true });
    await fs.writeFile(saveFile, JSON.stringify(data, null, 2), 'utf8');
    return true;
  });

  ipcMain.handle('load-data', async () => {
    try {
      const text = await fs.readFile(saveFile, 'utf8');
      return JSON.parse(text);
    } catch (e) {
      if (e.code === 'ENOENT') return null;
      throw e;
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
