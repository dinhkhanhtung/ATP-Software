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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var fs = require("fs");
var net = require('electron').net;
var rp = require('request-promise');

// Error logging setup to capture startup issues
process.on('uncaughtException', function (err) {
    try {
        fs.writeFileSync('C:\\Users\\ADMIN\\AppData\\Roaming\\SimpleUIDV2\\crash.log', 'Uncaught Exception:\n' + (err ? (err.stack || err.message || err) : 'Unknown error'));
    } catch (e) {}
});
process.on('unhandledRejection', function (reason) {
    try {
        fs.writeFileSync('C:\\Users\\ADMIN\\AppData\\Roaming\\SimpleUIDV2\\crash.log', 'Unhandled Rejection:\n' + (reason ? (reason.stack || reason.message || reason) : 'Unknown reason'));
    } catch (e) {}
});

var version = '2.2';
var win;
var production = false; // LOAD LOCAL FRONTEND
electron_1.app.on("ready", createWindow);
electron_1.app.on("activate", function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    try {
        // disable automatically detect setting
        electron_1.app.commandLine.appendSwitch('auto-detect', 'false');
        electron_1.app.commandLine.appendSwitch('no-proxy-server');
        electron_1.app.commandLine.appendSwitch('ignore-certificate-errors');
        electron_1.app.commandLine.appendSwitch('no-sandbox');
    }
    catch (e) {
        console.log(e);
    }
    // win = new BrowserWindow({ width: 950, height: 600 });
    win = new electron_1.BrowserWindow({ width: 1145, height: 670, webPreferences: {
            webSecurity: false,
            webviewTag: true,
            allowRunningInsecureContent: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        } });
    win.webContents.clearHistory();
    win.webContents.session.clearCache();
    win['version'] = version;
    win.setResizable(true);
    if (process.env.url_unit_test) {
        win.loadURL(process.env.url_unit_test);
    }
    else if (production) {
        win.loadURL('https://crm.alosoft.vn/simpleuid_23_02_2024/index.html');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, "/../../dist/angular-electron/index.html"),
            protocol: "file:",
            slashes: true
        }));
        // win.webContents.openDevTools();
    }
    try {
        var setupPushReceiver = require('electron-push-receiver').setup;
        setupPushReceiver(win.webContents);
    }
    catch (e) {
        console.log(e);
    }
    
    // Uncomment the next line to open devtools on startup for debugging:
    // win.webContents.openDevTools();
    
    if (!process.env.url_unit_test) {
        var template = [{
                label: "Application",
                submenu: [
                    { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
                    { type: "separator" },
                    { label: "Quit", accelerator: "Command+Q", click: function () { electron_1.app.quit(); } }
                ]
            }, {
                label: "Edit",
                submenu: [
                    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
                    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
                    { type: "separator" },
                    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
                ]
            }, {
                label: "View",
                submenu: [
                    { label: "DevTool", accelerator: "CmdOrCtrl+Shift+I", click: function () { win.webContents.openDevTools(); } }
                ]
            }
        ];
        electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(template));
    }
    win.on("closed", function () {
        win = null;
    });
    win.webContents.on('before-input-event', function (event, input) {
        // Mở DevTools -> Control+Shift+m
        if (input.shift && input.control && input.key.toLowerCase() === 'm') {
            win.webContents.openDevTools();
            return;
        }
        // Mở AppData -> Control+Shift+p
        if (input.shift && input.control && input.key.toLowerCase() === 'p') {
            var userAppDataPath = electron_1.app.getPath('userData');
            electron_1.shell.openExternal("file://" + userAppDataPath);
            return;
        }
    });
    return win;
}
function killChrome() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, killProcessIDUsingPort(9464)];
                case 1:
                    _a.sent();
                    electron_1.app.quit();
                    return [2 /*return*/];
            }
        });
    });
}
function killProcessIDUsingPort(port) {
    return new Promise(function (resolve) {
        try {
            var opsys = process.platform;
            var exec_1 = require("child_process").exec;
            if (opsys === 'darwin') {
                exec_1('kill -9 $(lsof -ti:' + port + ')', function (error, stdout, stderr) {
                    resolve('done');
                });
            }
            else if (opsys === 'win32' || opsys == 'win64') {
                exec_1('for /f "tokens=5" %a in (\'netstat -aon ^| findstr ' + port + '\') do @echo %~nxa', function (error, stdout, stderr) {
                    try {
                        var line = stdout.split('\n');
                        var processID = line[0].trim();
                        if (!processID) {
                            resolve('done');
                        }
                        else {
                            exec_1('taskkill /PID ' + processID + ' /F ', function (error, stdout, stderr) {
                                resolve('done');
                            });
                        }
                    }
                    catch (e) {
                        console.log(e);
                        resolve('done');
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
            resolve('done');
        }
    });
}
electron_1.ipcMain.on("getRequest", function (event, arg) {
    var headers = arg.headers;
    var idRender = arg.keyRender;
    var urlRedirect = '';
    var request = net.request({ url: arg.url, redirect: 'manual' });
    Object.keys(headers).forEach(function (key) {
        request.setHeader(key, headers[key]);
    });
    request.on('error', function (error) {
        try {
            event.sender.send("getRequestResponseError" + idRender, { 'response': getError(error) });
        }
        catch (e) {
            console.log(e);
        }
    });
    request.on('response', function (response) {
        var data = "";
        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            try {
                response['data'] = data;
                response['redirectURL'] = urlRedirect;
                event.sender.send("getRequestResponseSuccess" + idRender, { 'response': JSON.stringify(response) });
            }
            catch (e) {
                console.log(e);
            }
        });
    });
    request.on('redirect', function (statusCode, method, redirectURL, responseHeaders) {
        urlRedirect = redirectURL;
        request.followRedirect();
    });
    request.end();
});
electron_1.ipcMain.on("postRequest", function (event, arg) {
    var headers = arg.headers;
    var idRender = arg.keyRender;
    delete headers['Content-Length'];
    try {
        var request_1 = rp({
            method: 'POST',
            url: arg.url,
            simple: false,
            rejectUnauthorized: false,
            requestCert: true
        });
        var postData = arg.params;
        Object.keys(headers).forEach(function (key) {
            request_1.setHeader(key, headers[key]);
        });
        request_1.on('error', function (error) {
            try {
                event.sender.send("postRequestResponseError" + idRender, { 'response': getError(error) });
                console.log(error);
            }
            catch (e) {
                console.log(e);
            }
        });
        request_1.on('response', function (response) {
            var data = "";
            // console.log(`STATUS: ${response.statusCode}`)
            // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
            response.on('data', function (chunk) {
                data += chunk;
                // console.log(`BODY: ${chunk}`)
            });
            response.on('end', function () {
                // console.log('No more data in response.');
                try {
                    event.sender.send("postRequestResponseSuccess" + idRender, { 'response': JSON.stringify({ data: data }) });
                }
                catch (e) {
                    console.log(e);
                }
            });
        });
        request_1.write(postData);
        request_1.end();
    }
    catch (e) {
        event.sender.send("postRequestResponseError" + idRender, { 'response': getError(e) });
    }
});
electron_1.ipcMain.on("getFiles", function (event, arg) {
    console.log("C:\\");
    var files = fs.readdirSync("C:\\");
    win.webContents.send("getFilesResponse", files);
});
/*
noti
* */
var mapDataNoti = new Map();
var mapIntanceWindowsNoti = new Map();
electron_1.ipcMain.on('showNoti', function (event, dataNoti) {
    var id = dataNoti.idCampaign;
    if (mapIntanceWindowsNoti.get(id)) {
        mapIntanceWindowsNoti.get(id).show();
        return;
    }
    mapDataNoti.set(id, dataNoti);
    var instanceWindowsNoti = showNotification(dataNoti);
    mapIntanceWindowsNoti.set(id, instanceWindowsNoti);
});
electron_1.ipcMain.on('closeNoti', function (event, dataNoti) {
    var idCampaign = dataNoti.idCampaign;
    var windowsNoti = mapIntanceWindowsNoti.get(idCampaign);
    if (windowsNoti) {
        windowsNoti.close();
        windowsNoti = null;
        mapDataNoti.delete(idCampaign);
        mapIntanceWindowsNoti.delete(idCampaign);
    }
});
electron_1.ipcMain.on('clickNoti', function (event, dataNoti) {
    win.webContents.send("clickedNoti", dataNoti);
});
function showNotification(data) {
    var sizeScreen = getSizeScreen();
    var widthScreen = sizeScreen[0];
    var heightScreen = sizeScreen[1];
    var width = 400;
    var height = 220;
    var windowsNoti = new electron_1.BrowserWindow({
        width: width,
        maxHeight: 500,
        height: 187,
        maximizable: false,
        hasShadow: true,
        alwaysOnTop: true,
        resizable: false,
        frame: false,
        transparent: true,
        x: widthScreen - width,
        y: heightScreen - height + 10,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true
        }
    });
    var urlLoad = "http://crm.alosoft.vn/notiView/index.html";
    windowsNoti.webContents['dataNoti'] = data;
    windowsNoti.loadURL(urlLoad);
    //windowsNoti.webContents.openDevTools();
    return windowsNoti;
}
function getError(e) {
    var err = '';
    if (e) {
        err = e.message;
    }
    return err;
}
function getSizeScreen() {
    var _a = electron_1.screen.getPrimaryDisplay().workAreaSize, width = _a.width, height = _a.height;
    return [width, height];
}
//# sourceMappingURL=main.js.map
