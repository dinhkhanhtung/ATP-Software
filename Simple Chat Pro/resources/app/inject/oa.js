"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
window.alert = function (message) {
    console.log('alert', message);
};
var clipboard = require('electron').clipboard;
var ipcRenderer = require('electron').ipcRenderer;
console.log('inject oa');
window.onload = function () {
    document.getElementsByTagName('body')[0].addEventListener('mousedown', MyClick);
};
require("electron").ipcRenderer.on('onBeforeSendHeaders', function (event) {
    console.log(event);
});
require("electron").ipcRenderer.on('setTemplate', function (event, content) {
    var textArea = document.createElement("textarea");
    textArea.value = content;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    }
    catch (err) {
        console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
    var textareaMessenger = document.getElementsByClassName('rich-input empty');
    if (textareaMessenger !== undefined && textareaMessenger.length > 0) {
        textareaMessenger[0].focus();
        document.execCommand('paste');
    }
});
require("electron").ipcRenderer.on('FocusClick', function () {
    var textareaMessenger = document.getElementsByClassName('_58al _7tpc');
    textareaMessenger[0].focus();
});
function checkUnreadCount() {
    var unreadSpan = document.getElementById('unreadConvs').innerText;
    if (unreadSpan) {
        ipcRenderer.sendToHost('receiveWS', unreadSpan);
    }
}
checkLogin();
function checkLogin() {
    var intervalLoginZaloOA = setInterval(function () {
        try {
            var classwrapper = document.querySelectorAll('table.page-list');
            if (classwrapper.length === 0) {
                classwrapper = document.querySelectorAll('div.list_mess');
            }
            if (classwrapper.length === 0) {
                classwrapper = document.querySelectorAll('div.page-dashboard-inside');
            }
            if (classwrapper.length > 0) {
                require("electron").ipcRenderer.sendToHost('logged');
                clearInterval(intervalLoginZaloOA);
            }
        }
        catch (e) {
            console.log(e);
        }
    }, 2000);
}
require("electron").ipcRenderer.on('loadPageChat', function (event, pageID) { return __awaiter(_this, void 0, void 0, function () {
    var link;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!location.href.includes('chatv2')) return [3 /*break*/, 3];
                link = document.querySelector('a[href*="manage/choose?pageid=' + pageID + '"]');
                if (!link) return [3 /*break*/, 2];
                link.click();
                return [4 /*yield*/, sleep(1000)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                location.href = 'https://oa.zalo.me/chatv2?oaid=' + pageID;
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
function checkChatMain() {
    var check = 0;
    var intervalCheckChatMain = setInterval(function () {
        var chatMain = document.getElementById('chat_main');
        if (chatMain) {
            chatMain.style.width = 'calc(83% - 300px)';
            clearInterval(intervalCheckChatMain);
        }
        check++;
        if (check > 10) {
            clearInterval(intervalCheckChatMain);
        }
    }, 2000);
}
function MyClick(event) {
    try {
        checkChatMain();
        var classwrapperZalo = document.querySelectorAll('.item_mess');
        if (classwrapperZalo.length > 0) { //dạng danh bạ
            var bigDivData = event.target.closest(".item_mess");
            if (bigDivData !== undefined && bigDivData !== null) {
                var image = '';
                var name_1 = bigDivData.getElementsByClassName('mess_name')[0].innerText;
                var checkImg = bigDivData.getElementsByClassName('mess_avt');
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                }
                var checkId = image.split('/').length;
                var idTemp = image.split('/')[checkId - 1];
                var UID = idTemp.split('.')[0];
                require("electron").ipcRenderer.sendToHost('setDataCustomer', '');
                require("electron").ipcRenderer.sendToHost('sendId', name_1, UID, image, '');
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}
setInterval(function () {
    require("electron").ipcRenderer.sendToHost('showCircleTagInterval');
    checkUnreadCount();
}, 5000);
require("electron").ipcRenderer.on('showCircleTagInterval', function (event, listDataTag, uidCustomer) {
    var classwrapperZalo = document.querySelectorAll('.item_mess');
    if (classwrapperZalo.length > 0) { //dạng danh bạ
        var _loop_1 = function (j) {
            try {
                var ele = classwrapperZalo[j];
                var listTagEle = ele.querySelector('.listTag');
                var image = '';
                var checkImg = ele.getElementsByClassName('mess_avt');
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    var checkId = image.split('/').length;
                    var idTemp = image.split('/')[checkId - 1];
                    var UID = idTemp.split('.')[0];
                    if (uidCustomer === UID) {
                        if (listTagEle) {
                            var arrTag = listTagEle.getElementsByClassName('circle-tag');
                            var differenceTag = checkDifferenceTag(arrTag, listDataTag);
                            if (differenceTag) {
                                listTagEle.remove();
                                listTagEle = null;
                            }
                        }
                        if (listDataTag && !listTagEle) {
                            var node_1 = document.createElement('div');
                            node_1.style.position = 'absolute';
                            node_1.className += 'listTag';
                            node_1.style.right = '5px';
                            node_1.style.top = '62px';
                            node_1.style.display = 'flex';
                            ele.appendChild(node_1);
                            listDataTag.forEach(function (tag) {
                                if (tag && node_1) {
                                    node_1.innerHTML += '<div title="' + tag.name + '" class="circle-tag" id="circle' + tag.id + '" style="width: 12px; height: 12px; background-color: ' + tag.color + '; border-radius: 50%;margin-right: 2px;"></div>';
                                }
                            });
                        }
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        for (var j = 0; j < classwrapperZalo.length; j++) {
            _loop_1(j);
        }
    }
});
function checkDifferenceTag(arrTag, listDataTag) {
    if (arrTag.length !== listDataTag.length) {
        return true;
    }
    var _loop_2 = function (i) {
        var idTag = arrTag[i].id.split('circle')[1];
        if (idTag) {
            var tagInListData = listDataTag.find(function (tags) { return tags.id === Number(idTag); });
            if (!tagInListData) {
                return { value: true };
            }
        }
    };
    for (var i = 0; i < arrTag.length; i++) {
        var state_1 = _loop_2(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, ms); }).then()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
