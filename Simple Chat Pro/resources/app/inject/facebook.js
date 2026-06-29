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
window.alert = function (message) {
    console.log('alert', message);
};
var clipboard = require('electron').clipboard;
var isStartedGetCookie = false;
var ipcRenderer = require('electron').ipcRenderer;
console.log('inject facebook');
window.onload = function () {
    document.getElementsByTagName('body')[0].addEventListener('mousedown', MyClick);
};
clearPanelProfile();
function clearPanelProfile() {
    var clearPanel = setInterval(function () {
        try {
            var parent_1 = document.querySelectorAll('[role="main"]')[0].getElementsByClassName('x1dt7z5j')[0];
            if (!parent_1) {
                parent_1 = document.querySelectorAll('[role="main"]')[0].getElementsByClassName('x2ixbly')[0];
            }
            if (!parent_1) {
                parent_1 = document.querySelectorAll('[role="main"]')[0].getElementsByClassName('x4xrfw5')[0];
            }
            if (parent_1) {
                parent_1.setAttribute('style', 'display: none');
                require("electron").ipcRenderer.sendToHost('ResizeWebview');
                clearInterval(clearPanel);
            }
        }
        catch (e) {
            console.log(e);
        }
    }, 3000);
}
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
    var textareaMessenger = document.getElementsByClassName('notranslate');
    if (textareaMessenger !== undefined && textareaMessenger.length > 0) {
        textareaMessenger[0].focus();
        document.execCommand('paste');
    }
});
require("electron").ipcRenderer.on('FocusClick', function () {
    var textareaMessenger = document.getElementsByClassName('_58al _7tpc');
    textareaMessenger[0].focus();
});
function DisplayFillter() {
    require("electron").ipcRenderer.sendToHost('CallFillTer');
}
var intervalLoginFB = setInterval(function () {
    try {
        var classwrapper = document.querySelectorAll('[data-pagelet="MWThreadList"]');
        if (classwrapper.length === 0) {
            classwrapper = document.querySelectorAll('div.msg-item');
            if (classwrapper.length === 0) {
                classwrapper = document.querySelectorAll("div[data-id='div_TabCT_FrdItem']");
            }
            if (classwrapper.length === 0) {
                classwrapper = document.querySelectorAll("div[aria-label='Chat']");
            }
        }
        if (classwrapper.length > 0 && !isStartedGetCookie) {
            isStartedGetCookie = true;
            require("electron").ipcRenderer.sendToHost('logged');
            clearInterval(intervalLoginFB);
        }
        require("electron").ipcRenderer.sendToHost('showCircleTagInterval');
    }
    catch (e) {
        console.log(e);
    }
}, 3000);
require("electron").ipcRenderer.on('showCircleTagInterval', function (event, listDataTag, uidCustomer) {
    try {
        var divChat = document.querySelector('[data-pagelet="MWThreadList"]');
        var classwrapper = void 0;
        if (divChat) {
            classwrapper = divChat.querySelectorAll('[role="link"]');
        }
        else {
            classwrapper = document.querySelectorAll('[role="link"]');
        }
        var ele = void 0;
        var uid = void 0;
        var listTagEle = void 0;
        var _loop_1 = function (j) {
            try {
                ele = classwrapper[j];
                var span = void 0;
                var listSpan = ele.getElementsByTagName('span');
                if (listSpan.length > 0) {
                    span = listSpan[0];
                    if (!span.innerText) {
                        span = listSpan[1];
                    }
                    if (span) {
                        listTagEle = span.querySelector('.listTag');
                    }
                    else {
                        return "continue";
                    }
                }
                var linkMessage = '';
                try {
                    linkMessage = ele.href;
                }
                catch (e) {
                    console.log(e);
                }
                if (linkMessage) {
                    numb = linkMessage.match(/\/t\/(\d+)\//);
                    uid = numb ? numb[1] : undefined;
                    if (uidCustomer === uid) {
                        if (listTagEle) {
                            var arrTag = listTagEle.getElementsByClassName('circle-tag');
                            var differenceTag = checkDifferenceTag(arrTag, listDataTag);
                            if (differenceTag) {
                                listTagEle.remove();
                                listTagEle = null;
                            }
                        }
                        if (listDataTag && !listTagEle) {
                            var node_1;
                            if (span) {
                                node_1 = document.createElement('div');
                                node_1.className += 'listTag';
                                node_1.style.position = 'absolute';
                                node_1.style.top = '45px';
                                node_1.style.display = 'flex';
                                span.appendChild(node_1);
                            }
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
        var numb;
        for (var j = 0; j < classwrapper.length; j++) {
            _loop_1(j);
        }
    }
    catch (e) {
        console.log(e);
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
require("electron").ipcRenderer.on('sendNameFb', function (event, stringdata) { return __awaiter(_this, void 0, void 0, function () {
    var data, textareaMessenger;
    return __generator(this, function (_a) {
        try {
            data = document.getElementsByClassName('_58al _7tpc');
            if (data.length > 0) {
                data[0].value = '';
                textareaMessenger = document.getElementsByClassName('_58al _7tpc');
                clipboard.writeText(stringdata + "\r\n", 'selection');
                if (textareaMessenger !== undefined && textareaMessenger.length > 0) {
                    textareaMessenger[0].focus();
                    document.execCommand('paste');
                }
            }
        }
        catch (e) {
            console.log(e);
        }
        return [2 /*return*/];
    });
}); });
require("electron").ipcRenderer.on('searchMessage', function (event, stringdata) { return __awaiter(_this, void 0, void 0, function () {
    var seach;
    return __generator(this, function (_a) {
        seach = document.getElementsByClassName('_3szo');
        if (seach && seach.length > 0) {
            seach[0].click();
        }
        return [2 /*return*/];
    });
}); });
function MyClick(event) {
    try {
        var ele = event.target.closest("a[role=\"link\"]");
        if (event.target.closest("a[role=\"link\"]")) { // each filter message of user
            if (ele !== undefined && ele !== null) {
                var id = ele.href;
                if (!id) {
                    id = ele.getElementsByTagName('a')[0].href;
                }
                var numb = id.match(/\/t\/(\d+)\//);
                var uid = numb ? numb[1] : undefined;
                var name = '';
                var image = '';
                var birhtday = '';
                var result = '';
                if (ele.getElementsByTagName('g').length > 0) {
                    var orginalHtmlTagG = ele.getElementsByTagName('g')[0].innerHTML;
                    var startString = 'xlink:href="';
                    var endString = '"';
                    var indexStart = orginalHtmlTagG.indexOf(startString);
                    if (indexStart > -1) {
                        indexStart = indexStart + startString.length;
                        var indexEnd = orginalHtmlTagG.indexOf(endString, indexStart);
                        if (indexEnd > -1) {
                            result = orginalHtmlTagG.substring(indexStart, indexEnd);
                            if (result.includes('amp;')) {
                                result = result.replace(new RegExp('amp;', 'g'), '');
                            }
                            image = result;
                        }
                    }
                }
                else {
                    result = ele.getElementsByTagName('img')[0].src;
                    if (result.includes('amp;')) {
                        result = result.replace(new RegExp('amp;', 'g'), '');
                    }
                    image = result;
                }
                var listSpan = ele.getElementsByTagName('span');
                for (var i = 0; i < listSpan.length; i++) {
                    var checkName = listSpan[i].innerText;
                    if (checkName) {
                        if (checkName.includes('\n')) {
                            checkName = checkName.split('\n')[0];
                        }
                        name = checkName;
                        break;
                    }
                }
                if (!image.includes('emoji.php')) {
                    require("electron").ipcRenderer.sendToHost('removeTag');
                    if (uid) {
                        require("electron").ipcRenderer.sendToHost('setDataCustomer', '');
                    }
                    require("electron").ipcRenderer.sendToHost('sendId', name, uid, image, birhtday);
                    return;
                }
                // var intervalCheckId = setInterval(async () => {
                //     var queryHrefLinkFb: any = document.querySelector('[data-pagelet="MWInboxDetail_MessageList_Header"]').querySelector('[role="link"]');
                //     if (queryHrefLinkFb) {
                //         clearInterval(intervalCheckId);
                //         var id_facebook_pre = '';
                //         if (id.includes('e2ee')) {
                //             var linkIDFacebook = queryHrefLinkFb.href;
                //             var numbIdFB = linkIDFacebook.match(/\/(\d+)\//);
                //             id_facebook_pre = numbIdFB ? numbIdFB[1] : undefined;
                //         }
                //     }
                // }, 1000);
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}
console.log('hookWS');
function init() {
    //logWebSocketContext(); <-- For development
    decorateWebSocketConstructor();
}
function logWebSocketContext() {
    /* Keep this log for now, this is helpful to see what the socket contains. For example, connection status */
    console.log(WebSocket.prototype);
}
function logWebSocketTraffic(obj) {
    var message = obj.data ? obj.data : obj;
    var message_decode = _deframeMessages(message);
    var msg = message_decode[0].payloadMessage._getPayloadString();
    var checkMarketPlace = false;
    if (msg.includes('insertMessage') || msg.includes('LS.sp(\\"124\\"') || msg.includes('updateReadReceipt')) {
        console.log('msg:', msg);
        if (!msg.includes('appendDataTraceAddon')) {
            msg = JSON.parse(msg).payload;
            var idFriend = cutStringStartEnd(msg, 'checkAuthoritativeMessageExists",[19,"', '"]');
            if (!idFriend) {
                idFriend = cutStringStartEnd(msg, '[51,[2,1],[19,"', '"]');
            }
            if (idFriend.length > 3) {
                var dataJson = idFriend + '|facebook';
                ipcRenderer.sendToHost('receiveWS', dataJson);
            }
        }
    }
}
function getListDataId(string) {
    var listId = new Array();
    var regex = /\[(.*?)\]/g;
    var matches = string.match(regex);
    if (matches) {
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            var data = JSON.parse(match);
            var uid = decodeUidFacebook(data);
            listId.push(uid);
        }
    }
    return listId;
}
function decodeFacebookString(a) {
    var c = parseInt(a.substr(-8), 16);
    a = parseInt(a.substr(0, a.length - 8), 16);
    var data = [a >>> 1 ^ -(c & 1), ((c >>> 1) + (a & 1) * 2147483648 ^ -(c & 1)) >>> 0];
    return data[0] * 4294967296 + data[1];
}
function decodeUidFacebook(array) {
    return array[0] * 4294967296 + array[1];
}
function cutStringStartEnd(orginal, startString, endString) {
    var result = '';
    var indexStart = orginal.indexOf(startString);
    if (indexStart > -1) {
        indexStart = indexStart + startString.length;
        var indexEnd = orginal.indexOf(endString, indexStart);
        if (indexEnd > -1) {
            result = orginal.substring(indexStart, indexEnd);
        }
    }
    return result;
}
function _deframeMessages(a) {
    a = new Uint8Array(a);
    var b = [];
    try {
        c = 0;
        while (c < a.length) {
            var d = n(a, c), e = d[0];
            c = d[1];
            if (e !== null)
                b.push(e);
            else
                break;
        }
        // c < a.length && (this.receiveBuffer = a.subarray(c))
    }
    catch (e) {
        console.log(e);
    }
    return b;
}
function m(a, b) {
    this.type = a;
    for (var c in b)
        Object.prototype.hasOwnProperty.call(b, c) && (this[c] = b[c]);
}
function n(a, b) {
    var c = b, d = a[b], f = d >> 4;
    d = d &= 15;
    b += 1;
    var g, h = 0, i = 1;
    do {
        if (b == a.length)
            return [null, c];
        g = a[b++];
        h += (g & 127) * i;
        i *= 128;
    } while ((g & 128) !== 0);
    g = b + h;
    if (g > a.length)
        return [null, c];
    i = new m(f);
    c = d >> 1 & 3;
    f = q(a, b);
    b += 2;
    h = u(a, b, f);
    b += f;
    c > 0 && (i.messageIdentifier = q(a, b),
        b += 2);
    f = new z(a.subarray(b, g));
    (d & 1) == 1 && (f.retained = !0);
    (d & 8) == 8 && (f.duplicate = !0);
    f.qos = c;
    f.destinationName = h;
    i.payloadMessage = f;
    return [i, g];
}
function q(a, b) {
    return 256 * a[b] + a[b + 1];
}
function u(a, b, c) {
    var d = "", e, f = b;
    while (f < b + c) {
        var g = a[f++];
        if (g < 128)
            e = g;
        else {
            var i = a[f++] - 128;
            if (i < 0) {
                // throw new Error(j(h.MALFORMED_UTF, [g.toString(16), i.toString(16), ""]));
            }
            if (g < 224)
                e = 64 * (g - 192) + i;
            else {
                var k = a[f++] - 128;
                if (k < 0) {
                    // throw new Error(j(h.MALFORMED_UTF, [g.toString(16), i.toString(16), k.toString(16)]));
                }
                if (g < 240)
                    e = 4096 * (g - 224) + 64 * i + k;
                else {
                    var l = a[f++] - 128;
                    if (l < 0) {
                        // throw new Error(j(h.MALFORMED_UTF, [g.toString(16), i.toString(16), k.toString(16), l.toString(16)]));
                    }
                    if (g < 248)
                        e = 262144 * (g - 240) + 4096 * i + 64 * k + l;
                    else {
                    }
                    // throw new Error(j(h.MALFORMED_UTF, [g.toString(16), i.toString(16), k.toString(16), l.toString(16)]))
                }
            }
        }
        e > 65535 && (e -= 65536,
            d += String.fromCharCode(55296 + (e >> 10)),
            e = 56320 + (e & 1023));
        d += String.fromCharCode(e);
    }
    return d;
}
function z(a) {
    var b;
    if (typeof a === "string" || a instanceof ArrayBuffer || a instanceof Int8Array || a instanceof Uint8Array || a instanceof Int16Array || a instanceof Uint16Array || a instanceof Int32Array || a instanceof Uint32Array || a instanceof Float32Array || a instanceof Float64Array)
        b = a;
    else
        throw j(h.INVALID_ARGUMENT, [a, "newPayload"]);
    this._getPayloadString = function () {
        if (typeof b === "string")
            return b;
        else
            return u(b, 0, b.length);
    };
    this._getPayloadBytes = function () {
        if (typeof b === "string") {
            var a = new ArrayBuffer(s(b));
            a = new Uint8Array(a);
            t(b, a, 0);
            return a;
        }
        else
            return b;
    };
    var c;
    this._getDestinationName = function () {
        return c;
    };
    this._setDestinationName = function (a) {
        if (typeof a === "string")
            c = a;
        else
            throw new Error(j(h.INVALID_ARGUMENT, [a, "newDestinationName"]));
    };
    var d = 0;
    this._getQos = function () {
        return d;
    };
    this._setQos = function (a) {
        if (a === 0 || a === 1 || a === 2)
            d = a;
        else
            throw new Error("Invalid argument:" + a);
    };
    var e = !1;
    this._getRetained = function () {
        return e;
    };
    this._setRetained = function (a) {
        if (typeof a === "boolean")
            e = a;
        else
            throw new Error(j(h.INVALID_ARGUMENT, [a, "newRetained"]));
    };
    var f = !1;
    this._getDuplicate = function () {
        return f;
    };
    this._setDuplicate = function (a) {
        f = a;
    };
}
function decorateWebSocketConstructor() {
    var OrigWebSocket = window.WebSocket;
    var callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);
    var wsAddListener = OrigWebSocket.prototype.addEventListener;
    wsAddListener = wsAddListener.call.bind(wsAddListener);
    window.WebSocket = function WebSocket(url, protocols) {
        var ws;
        if (!(this instanceof WebSocket)) {
            ws = callWebSocket(this, arguments);
        }
        else if (arguments.length === 1) {
            ws = new OrigWebSocket(url);
        }
        else if (arguments.length >= 2) {
            ws = new OrigWebSocket(url, protocols);
        }
        else {
            ws = new OrigWebSocket();
        }
        wsAddListener(ws, 'open', function (event) {
            console.log('open');
            //TODO: Robby, implement connection pool
        });
        wsAddListener(ws, 'message', function (event) {
            logWebSocketTraffic(event.data);
        });
        wsAddListener(ws, 'close', function (event) {
            alert(close);
            //TODO: Robby, implement connection pool
        });
        return ws;
    }.bind();
    window.WebSocket.prototype = OrigWebSocket.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;
    var wsSend = OrigWebSocket.prototype.send;
    wsSend = wsSend.apply.bind(wsSend);
    OrigWebSocket.prototype.send = function (data) {
        return wsSend(this, arguments);
    };
}
init();
