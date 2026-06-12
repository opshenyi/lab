const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('node:path');

const isDev = Boolean(process.env.ELECTRON_START_URL);

const getAssetPath = (...segments) => path.join(__dirname, '..', ...segments);
const getWindowIconPath = () => (
  app.isPackaged
    ? path.join(process.resourcesPath, 'icon.ico')
    : getAssetPath('build', 'icon.ico')
);

const sendWindowState = window => {
  if (!window || window.isDestroyed()) return;

  window.webContents.send('sparklab:window-state', {
    isMaximized: window.isMaximized(),
    isFullScreen: window.isFullScreen(),
  });
};

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1120,
    minHeight: 720,
    title: 'SparkLab Student',
    backgroundColor: '#f7f6f2',
    icon: getWindowIconPath(),
    frame: false,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    sendWindowState(mainWindow);
  });

  mainWindow.on('maximize', () => sendWindowState(mainWindow));
  mainWindow.on('unmaximize', () => sendWindowState(mainWindow));
  mainWindow.on('enter-full-screen', () => sendWindowState(mainWindow));
  mainWindow.on('leave-full-screen', () => sendWindowState(mainWindow));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const currentUrl = mainWindow.webContents.getURL();
    const isSameDocument = url.startsWith(currentUrl.split('#')[0]);
    const isLocalDev = isDev && url.startsWith(process.env.ELECTRON_START_URL);
    const isPackagedFile = !isDev && url.startsWith('file://');

    if (!isSameDocument && !isLocalDev && !isPackagedFile) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  if (isDev) {
    mainWindow.loadURL(`${process.env.ELECTRON_START_URL}/#/login`);
  } else {
    mainWindow.loadFile(getAssetPath('dist', 'index.html'), { hash: '/login' });
  }
};

app.whenReady().then(() => {
  app.setAppUserModelId('com.sparklab.student');
  Menu.setApplicationMenu(null);

  ipcMain.handle('sparklab:get-app-info', () => ({
    name: app.getName(),
    version: app.getVersion(),
    platform: process.platform,
  }));

  ipcMain.handle('sparklab:window-minimize', event => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });

  ipcMain.handle('sparklab:window-toggle-maximize', event => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;

    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  });

  ipcMain.handle('sparklab:window-close', event => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
