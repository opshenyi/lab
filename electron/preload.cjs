const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sparkLabDesktop', {
  isDesktop: true,
  getAppInfo: () => ipcRenderer.invoke('sparklab:get-app-info'),
  minimize: () => ipcRenderer.invoke('sparklab:window-minimize'),
  toggleMaximize: () => ipcRenderer.invoke('sparklab:window-toggle-maximize'),
  close: () => ipcRenderer.invoke('sparklab:window-close'),
  onWindowState: callback => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('sparklab:window-state', listener);
    return () => ipcRenderer.removeListener('sparklab:window-state', listener);
  },
});
