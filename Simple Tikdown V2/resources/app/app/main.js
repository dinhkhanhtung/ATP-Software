"use strict";
const fs = require("fs");
const path = require("path");

try {
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
    require('@electron/remote/main').initialize();
    const proxyChain = require('proxy-chain');
    const request = require("request");
    let win = null;
    const args = process.argv.slice(1);
    const serve = args.some(val => val === '--serve');
    const devEnvironment = false;
    const productMode = true;
    let userAgentMacos = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36';
    let userAgentWindows = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36';
    let version = '21.42';
    let crmURL = 'https://crm.alosoft.vn';
    let serverFolderProduct = 'simple_tikdown_v2_14_05_2026';
    let serverFolderDev = 'simple_tikdown_v2_dev';
    function getUserAgent() {
        if (process.platform === 'darwin') {
            console.log('platform: Macos');
            return userAgentMacos;
        }
        else {
            console.log('platform: Windows');
            return userAgentWindows;
        }
    }
    function createWindow() {
        try {
            try {
                electron_1.app.commandLine.appendSwitch('auto-detect', 'false');
                electron_1.app.commandLine.appendSwitch('no-proxy-server');
                electron_1.app.commandLine.appendSwitch('ignore-certificate-errors');
                electron_1.app.commandLine.appendSwitch("no-sandbox");
            }
            catch (e) {
                console.log(e);
            }
            const size = electron_1.screen.getPrimaryDisplay().workAreaSize;
            // Create the browser window.
            win = new electron_1.BrowserWindow({
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
                    webviewTag: true,
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
                win['appPath'] = process.resourcesPath;
                win['version'] = version;
                if (devEnvironment) {
                    win.loadURL(crmURL + '/' + serverFolderDev + '/index.html');
                }
                else if (productMode) {
                    win.loadURL(crmURL + '/' + serverFolderProduct + '/index.html');
                }
            }
            
            // Luôn mở DevTools để gỡ lỗi
            win.webContents.openDevTools();
            
            win.webContents.setUserAgent(getUserAgent());
            win.on('closed', () => {
                win = null;
            });
            const contextMenu = electron_1.Menu.buildFromTemplate([
                { label: 'Cut', role: 'cut', accelerator: "CmdOrCtrl+X" },
                { label: 'Copy', role: 'copy', accelerator: "CmdOrCtrl+C" },
                { label: 'Paste', role: 'paste', accelerator: "CmdOrCtrl+V" },
            ]);
            win.webContents.on('context-menu', (_event, params) => {
                contextMenu.popup({ window: win, x: params.x, y: params.y }); // dùng x,y để xác định vị trí show menu
            });
            win.webContents.on('before-input-event', (event, input) => {
                // Mở DevTools -> Control+Shift+m
                if (input.shift && input.control && input.key.toLowerCase() === 'm') {
                    win.webContents.openDevTools();
                    return;
                }
                // Mở AppData -> Control+Shift+p
                if (input.shift && input.control && input.key.toLowerCase() === 'p') {
                    let userAppDataPath = electron_1.app.getPath('userData');
                    electron_1.shell.openExternal(`file://${userAppDataPath}`);
                    return;
                }
            });
            return win;
        } catch (err) {
            fs.writeFileSync('C:\\temp\\create_window_err.log', err.stack || err.toString());
            throw err;
        }
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
        fs.writeFileSync('C:\\temp\\app_ready_err.log', e.stack || e.toString());
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
                }, 60000);
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
        let finished = false;
        const cleanup = (message) => {
            if (finished)
                return;
            finished = true;
            if (interval) {
                clearInterval(interval);
            }
            removeFile(savePath);
            event.sender.send(keyStatusDownloadFile, { status: 'failure', message });
        };
        try {
            // kiểm tra đường dẫn lưu file có tồn tại
            let pathFolder = path.dirname(savePath);
            if (!fs.existsSync(pathFolder)) { // nếu đường dẫn thư mục lưu file không tồn tại thì báo lỗi
                cleanup('Không tìm thấy thư mục lưu tệp, vui lòng kiểm tra lại');
                return;
            }
            const request = electron_1.net.request(url);
            // đặt setInterval đếm mỗi s khi vượt quá 30s mà không nhận data thì huỷ req
            let requestCheck = false;
            let time = 0;
            interval = setInterval(() => {
                time = time + 1000;
                if (time >= 60000) {
                    requestCheck = true;
                    request.removeAllListeners();
                    cleanup('RequestTimeout');
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
                let message = getError(error);
                file.close();
                cleanup(message);
            });
            request.on('response', (response) => {
                if (response.statusCode && response.statusCode >= 400) {
                    request.removeAllListeners();
                    file.close();
                    cleanup(`Tải file thất bại. HTTP ${response.statusCode}`);
                    return;
                }
                try {
                    fileSize = parseInt(response.headers['content-length'], 10);
                }
                catch (error) { }
                response.on('data', (chunk) => {
                    if (fileSize && fileSize > 1) {
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
                    if (finished)
                        return;
                    finished = true;
                    clearInterval(interval);
                    file.end(() => {
                        file.close();
                    });
                    event.sender.send(keyStatusDownloadFile, { status: 'success', path: savePath });
                });
            });
            request.end();
        }
        catch (error) {
            let message = getError(error);
            cleanup(message);
        }
    }));
    electron_1.ipcMain.on("checkLinkDownload", (event, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { url, headers, keyRender } = args;
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
    electron_1.ipcMain.on("getStreamFile", (event, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { keyRender, filePath } = args;
        try {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    event.sender.send(`getStreamFileResponseSuccess${keyRender}`, err !== undefined ? err.message : '');
                }
                else {
                    event.sender.send(`getStreamFileResponseSuccess${keyRender}`, stats);
                }
            });
        }
        catch (error) {
            console.log("LỖI getStreamFile:", error);
            event.sender.send(`getStreamFileResponseSuccess${keyRender}`, getError(error));
        }
    }));
    function sendRequest(options) {
        if (!options.timeout) {
            options.timeout = 30000;
        }
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
    electron_1.ipcMain.on("uploadBinary", (event, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { url, headers, filePath, keyRender, proxy } = args;
        try {
            let options = {
                'method': 'POST',
                'url': url,
                'headers': headers,
                body: fs.createReadStream(filePath),
            };
            if (proxy) {
                options.proxy = proxy;
            }
            let data = yield sendRequest(options);
            event.sender.send(`uploadBinaryResponseSuccess${keyRender}`, data);
        }
        catch (error) {
            console.log("Lỗi uploadBinary catch:", error);
            event.sender.send(`uploadBinaryResponseError${keyRender}`, getError(error));
        }
    }));
    function removeFile(pathFile) {
        if (fs.existsSync(pathFile)) {
            fs.unlinkSync(pathFile);
        }
    }
    
    // Ghi log lỗi runtime ra thư mục C:\temp\ để debug
    process.on('uncaughtException', function (error) {
        console.log("Xảy ra lỗi main process", error);
        try {
            fs.appendFileSync('C:\\temp\\crash.log', `[${new Date().toISOString()}] Uncaught Exception: ${error.stack || error}\n`);
        } catch(e) {}
    });
    process.on('unhandledRejection', function (reason, promise) {
        console.log("Xảy ra unhandledRejection", reason);
        try {
            fs.appendFileSync('C:\\temp\\crash.log', `[${new Date().toISOString()}] Unhandled Rejection: ${reason.stack || reason}\n`);
        } catch(e) {}
    });
    
    electron_1.ipcMain.on('request:download-file', (event, channelId, options, savePath) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield downloadFile(options, savePath, (percent) => {
                event.sender.send(channelId, { status: 'loading', percent });
            });
            event.sender.send(channelId, { status: 'success' });
        }
        catch (error) {
            event.sender.send(channelId, { status: 'failure', message: error.message || 'Unknown error' });
        }
    }));
    function downloadFile(options, savePath, callbackProgressPercentage) {
        const maxRetries = 3;
        const partPath = `${savePath}.part`;
        const baseOptions = Object.assign(Object.assign({}, options), { timeout: options.timeout || 300000 });
        const parseTotalBytes = (response, startBytes) => {
            const contentRange = response.headers['content-range'];
            if (typeof contentRange === 'string') {
                const match = contentRange.match(/\/(\d+)$/);
                if (match) {
                    return parseInt(match[1], 10);
                }
            }
            const contentLength = parseInt(String(response.headers['content-length'] || '0'), 10);
            if (!contentLength) {
                return 0;
            }
            return response.statusCode === 206 ? startBytes + contentLength : contentLength;
        };
        const runAttempt = () => new Promise((resolve, reject) => {
            const startBytes = fs.existsSync(partPath) ? fs.statSync(partPath).size : 0;
            const headers = Object.assign({}, (baseOptions.headers || {}));
            if (startBytes > 0) {
                headers['Range'] = `bytes=${startBytes}-`;
            }
            let totalBytes = 0;
            let receivedBytes = startBytes;
            let fileStream = null;
            let settled = false;
            const fail = (error) => {
                if (settled)
                    return;
                settled = true;
                if (fileStream) {
                    fileStream.close();
                }
                reject(error);
            };
            const req = request(Object.assign(Object.assign({}, baseOptions), { headers }))
                .on('response', (response) => {
                const statusCode = response.statusCode || 0;
                if (statusCode === 416 && startBytes > 0) {
                    settled = true;
                    resolve();
                    return;
                }
                if (![200, 206].includes(statusCode)) {
                    fail(new Error(`Failed to download. Status code: ${statusCode}`));
                    return;
                }
                const canResume = statusCode === 206 && startBytes > 0;
                receivedBytes = canResume ? startBytes : 0;
                totalBytes = parseTotalBytes(response, receivedBytes);
                fileStream = fs.createWriteStream(partPath, { flags: canResume ? 'a' : 'w' });
                response
                    .on('data', (chunk) => {
                    receivedBytes += chunk.length;
                    fileStream.write(chunk);
                    if (totalBytes > 0) {
                        callbackProgressPercentage(Math.min(100, (receivedBytes / totalBytes) * 100));
                    }
                })
                    .on('end', () => {
                    if (!fileStream || settled)
                        return;
                    fileStream.end(() => {
                        const actualSize = fs.existsSync(partPath) ? fs.statSync(partPath).size : 0;
                        if (totalBytes > 0 && actualSize < totalBytes) {
                            fail(new Error(`Download incomplete: ${actualSize}/${totalBytes} bytes`));
                            return;
                        }
                        settled = true;
                        resolve();
                    });
                })
                    .on('error', fail);
            })
                .on('error', fail);
            req.on('abort', () => fail(new Error('Download aborted')));
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                removeFile(savePath);
                let lastError = null;
                for (let attempt = 0; attempt < maxRetries; attempt++) {
                    try {
                        yield runAttempt();
                        fs.renameSync(partPath, savePath);
                        callbackProgressPercentage(100);
                        resolve('');
                        return;
                    }
                    catch (error) {
                        lastError = error;
                    }
                }
                removeFile(partPath);
                reject(lastError || new Error('Download failed'));
            }
            catch (error) {
                removeFile(partPath);
                reject(error);
            }
        }));
    }
} catch (globalErr) {
    fs.writeFileSync('C:\\temp\\main_init.log', globalErr.stack || globalErr.toString());
}
