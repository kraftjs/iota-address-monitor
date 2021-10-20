import path from 'path';

import { app, BrowserWindow } from 'electron';

const debug = /--debug/.test(process.argv[3]);

if (debug) require('electron-reload')(__dirname);

let window: BrowserWindow;

function createWindow() {
    window = new BrowserWindow({
        show: false,
        width: 1080,
        minWidth: 680,
        height: 840,
        title: app.getName(),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: false,
            enableWebSQL: false,
            sandbox: true,
        },
    });
    window.loadFile(path.join(__dirname, '..', 'index.html'));

    if (process.platform === 'linux') {
        window.setIcon(path.join(__dirname, '..', 'assets', 'icon256x256.png'));
    }

    if (debug) {
        window.webContents.openDevTools();
        // window.maximize();
    }

    window.once('ready-to-show', () => {
        window.show();
    });
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
