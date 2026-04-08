const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Se hai già fatto il build (npm run build), carica il file index.html
  // Altrimenti, in fase di sviluppo, punta all'indirizzo locale
  win.loadFile(path.join(__dirname, 'dist/index.html')); 
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
