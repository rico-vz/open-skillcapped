const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('node:path');
const fs = require('fs');
const { updateElectronApp } = require('update-electron-app');

const createWindow = () => {
    updateElectronApp();
    
    const preloadPath = path.join(__dirname, 'preload.js');
    const iconPath = path.join(__dirname, '..', 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png');

    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 1000,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: true,
            contextIsolation: true,
            webSecurity: false
        },
        resizable: false,
        icon: iconPath
    });

    Menu.setApplicationMenu(null);

    mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
        callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Failed to load:', errorCode, errorDescription);
    });

    mainWindow.loadFile('src/renderer/index.html');
};

ipcMain.handle('show-save-dialog', async () => {
    const options = {
        title: 'Save Video As',
        defaultPath: path.join(app.getPath('downloads'), 'video.mp4'),
        filters: [
            { name: 'MP4 Videos', extensions: ['mp4'] }
        ]
    };

    return dialog.showSaveDialog(options);
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});