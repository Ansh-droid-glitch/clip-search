import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(app.getAppPath(), 'dekstopicon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(app.getAppPath(), 'dist-react', 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );
});