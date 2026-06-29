"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs = require("fs");
require('@electron/remote/main').initialize();
const proxyChain = require('proxy-chain');
const request = require("request");
let win = null;
const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
const productMode = true;
let listOpeningWindowsUser = new Map();
let version = '1.2';
let folderServerCRM = 'autoviralcontent_v2_25_08_2023';
function createWindow() {
    try {
        electron_1.app.commandLine.appendSwitch('auto-detect', 'false');
        electron_1.app.commandLine.appendSwitch('no-proxy-server');
        electron_1.app.commandLine.appendSwitch('ignore-certificate-errors');
    }
    catch (e) {
        console.log(e);
    }
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            plugins: true,
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
            webSecurity: false,
            nodeIntegrationInWorker: true,
            allowRunningInsecureContent: (serve),
            webviewTag: true
        },
    });
    win.webContents.clearHistory();
    win.webContents.session.clearCache();
    require("@electron/remote/main").enable(win.webContents);
    win['productMode'] = productMode;
    if (serve) {
        const debug = require('electron-debug');
        debug();
        require('electron-reloader')(module);
        win.loadURL('http://localhost:4200');
    }
    else {
        if (productMode) {
            win['appPath'] = process.resourcesPath;
            win['version'] = version;
            const path = require('path'); const url = require('url'); win.loadURL(url.format({ pathname: path.join(__dirname, 'frontend/index.html'), protocol: 'file:', slashes: true }));
        }
    }
    if (!productMode) {
        win.webContents.openDevTools();
    }
    win.on('closed', () => {
        listOpeningWindowsUser.forEach((value) => {
            if (!value.isDestroyed()) {
                value.destroy();
            }
        });
        listOpeningWindowsUser.clear();
        win = null;
    });
    return win;
}
try {
    // app.on('ready', () => setTimeout(createWindow, 400));
    electron_1.app.whenReady().then(createWindow);
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', () => {
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
}
function getError(error) {
    if (typeof error === 'string') {
        return error;
    }
    if (error && error.message) {
        return error.message;
    }
    return '';
}
function electronSendRequest({ url, method, headers, proxy, dataPost }) {
    console.log('electronSendRequest:', { url, headers, method, dataPost });
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let urlRedirect = url;
            let options = {
                url,
                redirect: 'manual',
                method
            };
            if (proxy) {
                const customSession = electron_1.session.fromPartition('custom-session');
                const proxiedUrl = yield proxyChain.anonymizeProxy(proxy);
                customSession.setProxy({ proxyRules: proxiedUrl });
                options.session = customSession;
            }
            const request = electron_1.net.request(options);
            Object.keys(headers).forEach(function (key) {
                request.setHeader(key, headers[key]);
            });
            let requestTimeout = setTimeout(() => {
                reject(new Error('RequestTimeout'));
                cleanup();
            }, 30000);
            const cleanup = () => {
                clearTimeout(requestTimeout);
                request.removeAllListeners();
            };
            request.on('error', (error) => {
                reject(new Error(getError(error)));
                cleanup();
            });
            request.on('response', (response) => {
                let responseData = '';
                response.on('data', (chunk) => {
                    responseData += chunk;
                });
                response.on('end', () => {
                    cleanup();
                    try {
                        const responseClone = JSON.parse(JSON.stringify(response));
                        responseClone.data = responseData;
                        responseClone.redirectURL = urlRedirect;
                        resolve(responseClone);
                    }
                    catch (error) {
                        reject(new Error(getError(error)));
                    }
                });
            });
            request.on('redirect', (statusCode, redirectMethod, redirectURL, responseHeaders) => {
                urlRedirect = redirectURL;
                request.followRedirect();
            });
            if (method === 'POST' && dataPost) {
                request.write(dataPost);
            }
            request.end();
        }
        catch (error) {
            reject(error);
        }
    }));
}
electron_1.ipcMain.on("getRequest", (event, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, headers, proxy, keyRender } = args;
    try {
        let data = yield electronSendRequest({ url, headers, method: "GET", proxy });
        event.sender.send(`getRequestResponseSuccess${keyRender}`, data);
    }
    catch (error) {
        console.log("LỖI SEND GET:", error);
        event.sender.send(`getRequestResponseError${keyRender}`, getError(error));
    }
}));
electron_1.ipcMain.on("postRequest", (event, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, headers, dataPost, proxy, keyRender } = args;
    try {
        let data = yield electronSendRequest({ url, headers, method: "POST", proxy, dataPost });
        event.sender.send(`postRequestResponseSuccess${keyRender}`, data);
    }
    catch (error) {
        console.log("LỖI SEND POST:", error);
        event.sender.send(`postRequestResponseError${keyRender}`, getError(error));
    }
}));
electron_1.ipcMain.on("downloadFile", (event, args) => __awaiter(void 0, void 0, void 0, function* () {
    let { url, headers, savePath, idRender } = args;
    let keyStatusDownloadFile = `statusDownloadFile${idRender}`;
    let interval;
    try {
        const request = electron_1.net.request(url);
        // đặt setInterval đếm mỗi s khi vượt quá 30s mà không nhận data thì huỷ req
        let requestCheck = false;
        let time = 0;
        interval = setInterval(() => {
            time = time + 1000;
            if (time >= 30000) {
                requestCheck = true;
                event.sender.send(keyStatusDownloadFile, { status: 'failure', message: 'RequestTimeout' });
                request.removeAllListeners();
                clearInterval(interval);
            }
        }, 1000);
        Object.keys(headers).forEach(function (key) {
            request.setHeader(key, headers[key]);
        });
        const file = fs.createWriteStream(savePath);
        let fileSize;
        let downloadedBytes = 0;
        let prevProgressPercentage = 0;
        request.on('error', (error) => {
            clearInterval(interval);
            event.sender.send(keyStatusDownloadFile, { status: 'failure', message: getError(error) });
        });
        request.on('response', (response) => {
            try {
                fileSize = parseInt(response.headers['content-length'], 10);
            }
            catch (error) { }
            response.on('data', (chunk) => {
                if (fileSize) {
                    downloadedBytes += chunk.length;
                    const progressPercentage = Math.floor((downloadedBytes / fileSize) * 100);
                    if (progressPercentage > prevProgressPercentage) {
                        prevProgressPercentage = progressPercentage;
                        event.sender.send(keyStatusDownloadFile, { status: 'loading', progressPercentage });
                    }
                }
                if (requestCheck) { //khi timeout mà vẫn nạp data vào file thì huỷ bỏ request đi
                    request.removeAllListeners();
                }
                // mỗi khi có data được đẩy vào tệp thì reset lại thời gian chờ timeout
                time = 0;
                file.write(chunk);
            });
            response.on('end', () => {
                clearInterval(interval);
                file.end();
                event.sender.send(keyStatusDownloadFile, { status: 'success', path: savePath });
            });
        });
        request.end();
    }
    catch (error) {
        clearInterval(interval);
        event.sender.send(keyStatusDownloadFile, { status: 'failure', message: getError(error) });
    }
}));
electron_1.ipcMain.on("checkLinkDownload", (event, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, headers, keyRender } = args;
    console.log("checkLinkDownload:", { url, headers, keyRender });
    request.head(url, (error, response) => {
        if (error) {
            event.sender.send(`checkLinkDownloadError${keyRender}`, getError(error));
        }
        else {
            if (response.statusCode === 200) {
                event.sender.send(`checkLinkDownloadSuccess${keyRender}`);
            }
            else {
                event.sender.send(`checkLinkDownloadError${keyRender}`, `{"statusCode": ${response.statusCode}}`);
            }
        }
    });
}));
process.on('uncaughtException', function (error) {
    console.log("Xảy ra lỗi main process", error);
});
function sendRequest(options) {
    if (!options.timeout) {
        options.timeout = 30000;
    }
    console.log('sendRequest:', { options });
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            }
            else {
                let responseClone = JSON.parse(JSON.stringify(response));
                responseClone['data'] = body;
                resolve(responseClone);
            }
        });
    });
}
electron_1.ipcMain.on("sendRequest", (event, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyResponseSuccess, keyResponseError, options } = args;
    try {
        let data = yield sendRequest(options);
        event.sender.send(keyResponseSuccess, data);
    }
    catch (error) {
        console.log("LỖI sendRequest:", error);
        event.sender.send(keyResponseError, getError(error));
    }
}));
electron_1.ipcMain.on("newUserWindows", (event, args) => __awaiter(void 0, void 0, void 0, function* () {
    let user = args.user;
    let userId = user._userId;
    let name = user._name;
    let key = args.key;
    let userWindows = listOpeningWindowsUser.get(userId);
    if (userWindows) {
        if (userWindows.isMinimized())
            userWindows.restore();
        userWindows.focus();
        return;
    }
    const size = electron_1.screen.getPrimaryDisplay().workAreaSize;
    userWindows = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            plugins: true,
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
            webSecurity: false,
            nodeIntegrationInWorker: true,
            allowRunningInsecureContent: (serve),
        },
    });
    userWindows.maximize();
    userWindows.webContents.on('did-finish-load', () => {
        userWindows.setTitle(name + ' - ' + userId);
    });
    listOpeningWindowsUser.set(userId, userWindows);
    userWindows.on('closed', () => {
        userWindows = null;
        listOpeningWindowsUser.delete(userId);
    });
    userWindows['userWindows'] = { name: 'userWindows', user, key };
    userWindows.webContents.clearHistory();
    userWindows.webContents.session.clearCache();
    require("@electron/remote/main").enable(userWindows.webContents);
    if (serve) {
        const debug = require('electron-debug');
        debug();
        require('electron-reloader')(module);
        userWindows.loadURL('http://localhost:4200');
    }
    else {
        if (productMode) {
            userWindows['appPath'] = process.resourcesPath;
            const path = require('path'); const url = require('url'); userWindows.loadURL(url.format({ pathname: path.join(__dirname, 'frontend/index.html'), protocol: 'file:', slashes: true }));
        }
    }
}));
electron_1.ipcMain.on('close-user-windows', (event, args) => {
    let userId = args.userId;
    let userWindows = listOpeningWindowsUser.get(userId);
    if (userWindows && !userWindows.isDestroyed()) {
        userWindows.destroy();
        userWindows = null;
        listOpeningWindowsUser.delete(userId);
        event.sender.send('app-closed', userId);
    }
});
//# sourceMappingURL=main.js.map