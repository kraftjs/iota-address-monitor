import path from 'path';

import { app, BrowserWindow } from 'electron';

require('electron-reload')(__dirname);

const debug = /--debug/.test(process.argv[3]);

let window: BrowserWindow;

function createWindow() {
    const windowOptions = {
        width: 1080,
        minWidth: 680,
        height: 840,
        title: app.getName(),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: false,
            enableWebSQL: false,
        },
    };

    window = new BrowserWindow(windowOptions);
    window.loadFile(path.join(__dirname, '..', 'index.html'));

    if (debug) {
        window.webContents.openDevTools();
        // window.maximize();
    }
}

const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
    app.quit();
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.once('ready', () => {
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('second-instance', () => {
    if (window) {
        if (window.isMinimized()) {
            window.restore();
        }
        window.focus();
    }
});
