const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 800,
    icon: path.join(__dirname, 'images', 'galaxia.ico'), 
    webPreferences: {
      nodeIntegration: false, // 보안 강화를 위해 비활성화
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  win.loadFile('index.html');
}

// 저장/불러오기 처리
const saveFile = path.join(__dirname, 'save.json');

ipcMain.handle('save-data', (event, data) => {
  fs.writeFileSync(saveFile, JSON.stringify(data), 'utf-8');
  return true;
});

ipcMain.handle('load-data', () => {
  if (fs.existsSync(saveFile)) {
    return JSON.parse(fs.readFileSync(saveFile, 'utf-8'));
  }
  return null;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});