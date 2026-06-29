
window.alert = function (message) {
    console.log('alert', message);
};

let clipboard = require('electron').clipboard;
let isStartedGetCookie = false;
var ipcRenderer = require('electron').ipcRenderer;

console.log('inject facebook');

window.onload = () => {
    document.getElementsByTagName('body')[0].addEventListener('mousedown', MyClick);
    // Start Fillter giao diện mới 05/23/2019
    let iconFillter: any = document.querySelector('._6-xo');
    if (iconFillter !== null) {
        let windowWidth = window.screen.width;
        if (windowWidth <= 1280) {
            let node = document.createElement('img');
            node.style.position = 'absolute';
            node.style.left = '15%';
            node.style.top = '16px';
            node.style.width = '26px';
            node.src = 'https://crm.alosoft.vn/icons8ds.png';
            node.addEventListener("click", DisplayFillter);
            iconFillter.appendChild(node);
        } else if (windowWidth > 1280 && windowWidth < 1370) {
            let node = document.createElement('img');
            node.style.position = 'absolute';
            node.style.left = '15%';
            node.style.top = '16px';
            node.style.width = '26px';
            node.src = 'https://crm.alosoft.vn/icons8ds.png';
            node.addEventListener("click", DisplayFillter);
            iconFillter.appendChild(node);
        } else if (windowWidth > 1370 && windowWidth < 1600) {
            let node = document.createElement('img');
            node.style.position = 'absolute';
            node.style.left = '14%';
            node.style.top = '16px';
            node.style.width = '26px';
            node.src = 'https://crm.alosoft.vn/icons8ds.png';
            node.addEventListener("click", DisplayFillter);
            iconFillter.appendChild(node);
        } else if (windowWidth > 1600 && windowWidth < 1681) {
            let node = document.createElement('img');
            node.style.position = 'absolute';
            node.style.left = '12%';
            node.style.top = '16px';
            node.style.width = '26px';
            node.src = 'https://crm.alosoft.vn/icons8ds.png';
            node.addEventListener("click", DisplayFillter);
            iconFillter.appendChild(node);
        } else {
            let node = document.createElement('img');
            node.style.position = 'absolute';
            node.style.left = '12%';
            node.style.top = '16px';
            node.style.width = '26px';
            node.src = 'https://crm.alosoft.vn/icons8ds.png';
            node.addEventListener("click", DisplayFillter);
            iconFillter.appendChild(node);
        }
    } else {
        try {
            let iconFillter: any = document.querySelector('._36ic._5l-3');
            let node = document.createElement('img');
            node.style.position = 'absolute';
            node.style.left = '45px';
            node.style.top = '12px';
            node.style.width = '26px';
            node.src = 'https://crm.alosoft.vn/icons8ds.png';
            node.addEventListener("click", DisplayFillter);
            iconFillter.appendChild(node);
        } catch (e) {
            console.log(e);
        }
    }
    // End Fillter giao diện cũ
    sendListUIDGetColorTag();
    let divChat = document.querySelector('[data-pagelet="MWThreadList"]');
    let classwrapper = divChat.querySelectorAll('[role="link"]');
    if (classwrapper !== undefined && classwrapper.length > 0) {
        let link: any = classwrapper[0];
        let linkMessage = '';
        try {
            linkMessage = link.href;
        } catch (e) {
            console.log(e);
        }
        if (linkMessage) {
            let uid = linkMessage.split('/')[4];
            if (!(!/\D/.test(uid))) {
                uid = linkMessage.split('/')[5];
            }
            let name = '';
            let image = '';
            let birhtday: string = '';
            let listSpan = classwrapper[0].getElementsByTagName('span');
            for (let i = 0; i < listSpan.length; i++) {
                let checkName = listSpan[i].innerText;
                if (checkName) {
                    if (checkName.includes('\n')) {
                        checkName = checkName.split('\n')[0];
                    }
                    name = checkName;
                    break;
                }
            }
            let resultImage = '';
            if (classwrapper[0].getElementsByTagName('g').length > 0) {
                let orginalHtmlTagG = classwrapper[0].getElementsByTagName('g')[0].innerHTML;
                let startString = 'xlink:href="';
                let endString = '"';
                let indexStart = orginalHtmlTagG.indexOf(startString);
                if (indexStart > -1) {
                    indexStart = indexStart + startString.length;
                    let indexEnd = orginalHtmlTagG.indexOf(endString, indexStart);
                    if (indexEnd > -1) {
                        resultImage = orginalHtmlTagG.substring(indexStart, indexEnd);
                        if (resultImage.includes('amp;')) {
                            resultImage = resultImage.replace(new RegExp('amp;', 'g'), '');
                        }
                        image = resultImage;
                    }
                }
            }
            require("electron").ipcRenderer.sendToHost('sendId', name, uid, image, birhtday);
            // end giao diện cũ
        }
    }
};

function sendListUIDGetColorTag() {
    let listUID = [];
    let divChat = document.querySelector('[data-pagelet="MWThreadList"]');
    let classwrapper = divChat.querySelectorAll('[role="link"]');
    for (let i = 0; i < classwrapper.length; i++) {
        let ele: any = classwrapper[i];
        let linkMessage = '';
        try {
            linkMessage = ele.href;
        } catch (e) {
            console.log(e);
        }
        if (linkMessage) {
            let uid = linkMessage.split('/')[4];
            if (!(!/\D/.test(uid))) {
                uid = linkMessage.split('/')[5];
            }
            listUID.push(uid);
        }
    }
    require("electron").ipcRenderer.sendToHost('sendListId', listUID);
}

function RemovePanelProfile() {
    let clearPanel = setInterval(() => {
        let parent = document.querySelectorAll('[role="main"]')[0].getElementsByClassName('x1dt7z5j')[0];
        if (!parent) {
            parent = document.querySelectorAll('[role="main"]')[0].getElementsByClassName('x2ixbly')[0];
        }
        if (!parent) {
            parent = document.querySelectorAll('[role="main"]')[0].getElementsByClassName('x4xrfw5')[0];
        }
        if (parent) {
            parent.setAttribute('style', 'display: none');
            require("electron").ipcRenderer.sendToHost('ResizeWebview');
            clearInterval(clearPanel);
        }
    }, 3000);
}
require("electron").ipcRenderer.on('RemovePanelProfile', (event) => {
    RemovePanelProfile();
});

require("electron").ipcRenderer.on('showCircleTag', (event, listdata, listUID) => {
    if (listdata === "null") {
        let child = document.getElementsByClassName('listTag');
        for (let j = 0; j < child.length; j++) {
            child[j].remove();
        }
        let eleTag = document.getElementsByClassName('tooltip');
        if (eleTag.length !== 0) {
            Array.prototype.slice.call(eleTag).forEach(function (key) {
                key.remove();
            });
        }
    }
    let divChat = document.querySelector('[data-pagelet="MWThreadList"]');
    let classwrapper = divChat.querySelectorAll('[role="link"]');
    let child = document.getElementsByClassName('listTag');
    for (let j = 0; j < child.length; j++) {
        child[j].remove();
    }
    let ele;
    let uid;
    for (let j = 0; j < classwrapper.length; j++) {
        ele = classwrapper[j];
        let span;
        let listSpan = ele.getElementsByTagName('span');
        if (listSpan.length > 0) {
            span = listSpan[0];
            if (!span.innerText) {
                span = listSpan[1];
            }
            if (!span) {
                continue
            }
        }
        let linkMessage = '';
        try {
            linkMessage = ele.href;
        } catch (e) {
            console.log(e);
        }
        if (linkMessage) {
            uid = linkMessage.split('/')[4];
            if (!(!/\D/.test(uid))) {
                uid = linkMessage.split('/')[5];
            }
            if (listUID === uid) {
                if (listdata !== '' && listdata !== undefined && listdata !== null) {
                    let eleTag = ele.getElementsByClassName('tooltip');
                    if (eleTag.length !== 0) {
                        Array.prototype.slice.call(eleTag).forEach(function (key) {
                            key.remove();
                        });
                    }
                    if (listdata.length === 0) {
                        let child = document.getElementsByClassName('listTag');
                        for (let j = 0; j < child.length; j++) {
                            child[j].remove();
                        }
                    }
                    let node;
                    if (span) {
                        node = document.createElement('div');
                        node.className += 'listTag';
                        node.style.position = 'absolute';
                        node.style.top = '34px';
                        span.appendChild(node);
                    }
                    listdata.forEach(element => {
                        if (element.length !== 0) {
                            if (node !== undefined) {
                                node.innerHTML += '<svg class="tooltip" id="tag-svg" height="12" width="12"><circle id="circle" cx = "7" cy = "7" r = "5"  fill ="' + element[0].color + '">' + '</svg>';
                            }
                        }
                    });
                }
            }
        }
    }
});

require("electron").ipcRenderer.on('setTemplate', (event, content) => {
    const textArea = document.createElement("textarea");
    textArea.value = content;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
    let textareaMessenger: any = document.getElementsByClassName('notranslate');
    if (textareaMessenger !== undefined && textareaMessenger.length > 0) {
        textareaMessenger[0].focus();
        document.execCommand('paste');
    }
});
require("electron").ipcRenderer.on('FocusClick', () => {
    let textareaMessenger: any = document.getElementsByClassName('_58al _7tpc');
    textareaMessenger[0].focus();
});

function DisplayFillter() {
    require("electron").ipcRenderer.sendToHost('CallFillTer');
}

let intervalLoginFB = setInterval(() => {
    let classwrapper: any = document.querySelectorAll('[data-pagelet="MWThreadList"]');
    if (classwrapper.length === 0) {
        classwrapper = document.querySelectorAll('div.msg-item');
        if (classwrapper.length === 0) {
            classwrapper = document.querySelectorAll("div[data-id='div_TabCT_FrdItem']");
        }
    }
    if (classwrapper.length > 0 && !isStartedGetCookie) {
        isStartedGetCookie = true;
        require("electron").ipcRenderer.sendToHost('logged');
        clearInterval(intervalLoginFB);
    }
    require("electron").ipcRenderer.sendToHost('showCircleTagInterval');
}, 2000);

require("electron").ipcRenderer.on('showCircleTagInterval', (event, listdata, listUID) => {
    let divChat = document.querySelector('[data-pagelet="MWThreadList"]');
    let classwrapper = divChat.querySelectorAll('[role="link"]');
    let ele;
    let uid;
    let lengthTag;
    for (let j = 0; j < classwrapper.length; j++) {
        ele = classwrapper[j];
        let span;
        let listSpan = ele.getElementsByTagName('span');
        if (listSpan.length > 0) {
            span = listSpan[0];
            if (!span.innerText) {
                span = listSpan[1];
            }
            if (span) {
                lengthTag = span.querySelector('.listTag');
            } else {
                continue;
            }
        }
        let linkMessage = '';
        try {
            linkMessage = ele.href;
        } catch (e) {
            console.log(e);
        }
        if (linkMessage) {
            uid = linkMessage.split('/')[4];
            if (!(!/\D/.test(uid))) {
                uid = linkMessage.split('/')[5];
            }
            if ((listUID === uid) && (lengthTag === null || lengthTag === undefined)) {
                if (listdata !== '' && listdata !== undefined && listdata !== null) {
                    let node;
                    if (span) {
                        // let threadlistLastMessage = ele.querySelectorAll('[data-testid="threadlist-last-message"]')[0];
                        node = document.createElement('div');
                        node.className += 'listTag';
                        node.style.position = 'absolute';
                        node.style.top = '34px';
                        span.appendChild(node);
                    }
                    listdata.forEach(element => {
                        if (element.length !== 0) {
                            if (node !== undefined) {
                                node.innerHTML += '<svg class="tooltip" id="tag-svg" height="12" width="12"><circle id="circle" cx = "7" cy = "7" r = "5"  fill ="' + element[0].color + '">' + '</svg>';
                            }
                        }
                    });
                }
            }
        }
    }
});
require("electron").ipcRenderer.on('sendNameFb', async (event, stringdata) => {
    let data: any = document.getElementsByClassName('_58al _7tpc');
    data[0].value = '';
    let textareaMessenger: any = document.getElementsByClassName('_58al _7tpc');
    clipboard.writeText(stringdata + "\r\n", 'selection');
    if (textareaMessenger !== undefined && textareaMessenger.length > 0) {
        textareaMessenger[0].focus();
        document.execCommand('paste');
    }
});

require("electron").ipcRenderer.on('searchMessage', async (event, stringdata) => {
    let seach: any = document.getElementsByClassName('_3szo');
    if (seach !== undefined && seach.length > 0) {
        seach[0].click();
    }
});

function MyClick(event) {
    try {
        let ele = event.target.closest(`a[role="link"]`);
        if (event.target.closest(`a[role="link"]`)) { // each filter message of user
            if (ele !== undefined && ele !== null) {
                let id = ele.href;
                if (!id) {
                    id = ele.getElementsByTagName('a')[0].href;
                }
                var numb = id.match(/\d/g);
                numb = numb.join("");
                let uid = numb;
                let name = '';
                let image = '';
                let birhtday: string = '';
                let result = '';
                if (ele.getElementsByTagName('g').length > 0) {
                    let orginalHtmlTagG = ele.getElementsByTagName('g')[0].innerHTML;
                    let startString = 'xlink:href="';
                    let endString = '"';
                    let indexStart = orginalHtmlTagG.indexOf(startString);
                    if (indexStart > -1) {
                        indexStart = indexStart + startString.length;
                        let indexEnd = orginalHtmlTagG.indexOf(endString, indexStart);
                        if (indexEnd > -1) {
                            result = orginalHtmlTagG.substring(indexStart, indexEnd);
                            if (result.includes('amp;')) {
                                result = result.replace(new RegExp('amp;', 'g'), '');
                            }
                            image = result;
                        }
                    }
                } else {
                    result = ele.getElementsByTagName('img')[0].src;
                    if (result.includes('amp;')) {
                        result = result.replace(new RegExp('amp;', 'g'), '');
                    }
                    image = result;
                }
                let listSpan = ele.getElementsByTagName('span');
                for (let i = 0; i < listSpan.length; i++) {
                    let checkName = listSpan[i].innerText;
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
                        require("electron").ipcRenderer.sendToHost('removePanel', '');
                    }
                    require("electron").ipcRenderer.sendToHost('sendId', name, uid, image, birhtday);
                    return;
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
}

require("electron").ipcRenderer.on('ChangeTag', (event, tags, uidCustomer) => {
    let divChat = document.querySelector('[data-pagelet="MWThreadList"]');
    let classwrapper = divChat.querySelectorAll('[role="link"]');
    let ele;
    let uid;
    let child = document.getElementsByClassName('listTag');
    for (let j = 0; j < child.length; j++) {
        child[j].remove();
    }
    for (let j = 0; j < classwrapper.length; j++) {
        ele = classwrapper[j];
        let span;
        let listSpan = ele.getElementsByTagName('span');
        if (listSpan.length > 0) {
            span = listSpan[0];
            if (!span.innerText) {
                span = listSpan[1];
            }
            if (!span) {
                continue
            }
        }
        let linkMessage = '';
        try {
            linkMessage = ele.href;
        } catch (e) {
            console.log(e);
        }
        if (linkMessage) {
            uid = linkMessage.split('/')[4];
            if (!(!/\D/.test(uid))) {
                uid = linkMessage.split('/')[5];
            }
            if (uidCustomer === uid) {
                let eleTag = ele.getElementsByClassName('tooltip');
                if (eleTag.length !== 0) {
                    Array.prototype.slice.call(eleTag).forEach(function (key) {
                        key.remove();
                    });
                }
                let node;
                if (span) {
                    node = document.createElement('div');
                    node.style.position = 'absolute';
                    node.style.top = '34px';
                    span.appendChild(node);
                }
                tags.forEach(element => {
                    if (element.color !== undefined) {
                        node.innerHTML += '<svg class="tooltip" id="tag-svg" height="12" width="12" ><circle id="circle" cx = "7" cy = "7" r = "5"  fill ="' + element.color + '">' + '</svg>';
                    }
                });
            }
        }
    }
    require("electron").ipcRenderer.sendToHost('removeTag')
});


require("electron").ipcRenderer.on('updateTag', (event, tags, uidCustomer) => {
    let divChat = document.querySelector('[data-pagelet="MWThreadList"]');
    let classwrapper = divChat.querySelectorAll('[role="link"]');
    let ele;
    let uid;
    let child = document.getElementsByClassName('listTag');
    for (let j = 0; j < child.length; j++) {
        child[j].remove();
    }
    for (let j = 0; j < classwrapper.length; j++) {
        ele = classwrapper[j];
        let span;
        let listSpan = ele.getElementsByTagName('span');
        if (listSpan.length > 0) {
            span = listSpan[0];
            if (!span.innerText) {
                span = listSpan[1];
            }
            if (!span) {
                continue
            }
        }
        let linkMessage = '';
        try {
            linkMessage = ele.href;
        } catch (e) {
            console.log(e);
        }
        if (linkMessage) {
            uid = linkMessage.split('/')[4];
            if (!(!/\D/.test(uid))) {
                uid = linkMessage.split('/')[5];
            }
            if (uidCustomer === uid) {
                let eleTag = ele.getElementsByClassName('tooltip');
                if (eleTag.length !== 0) {
                    Array.prototype.slice.call(eleTag).forEach(function (key) {
                        key.remove();
                    });
                }
                //    $(eleTag).remove();
                let node;
                if (span) {
                    node = document.createElement('div');
                    node.style.position = 'absolute';
                    node.style.top = '34px';
                    span.appendChild(node);
                }
                tags.forEach(element => {
                    if (element.color !== undefined) {
                        node.innerHTML += '<svg class="tooltip" id="tag-svg" height="12" width="12" ><circle id="circle" cx = "7" cy = "7" r = "5"  fill ="' + element.color + '">' + '</svg>';
                    }
                });
            }
        }
    }
    require("electron").ipcRenderer.sendToHost('removeTag')
});


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
    if (msg.includes('insertMessage') || msg.includes('LS.sp(\\"124\\"')) {
        if (!msg.includes('appendDataTraceAddon')) {
            msg = JSON.parse(msg).payload;
            let idFriend = cutStringStartEnd(msg, 'checkAuthoritativeMessageExists",[19,"', '"]');
            let dataJson = idFriend + '|facebook';
            ipcRenderer.sendToHost('receiveWS', dataJson);
        }
    }
}

function getListDataId(string) {
    let listId = new Array();
    let regex = /\[(.*?)\]/g;
    let matches = string.match(regex);
    if (matches) {
        for (let match of matches) {
            let data = JSON.parse(match);
            let uid = decodeUidFacebook(data);
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
    let result = '';
    let indexStart = orginal.indexOf(startString);
    if (indexStart > -1) {
        indexStart = indexStart + startString.length;
        let indexEnd = orginal.indexOf(endString, indexStart);
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
            var d = n(a, c)
                , e = d[0];
            c = d[1];
            if (e !== null)
                b.push(e);
            else
                break
        }
        // c < a.length && (this.receiveBuffer = a.subarray(c))
    } catch (e) {
        console.log(e);
    }
    return b
}

function m(a, b) {
    this.type = a;
    for (var c in b)
        Object.prototype.hasOwnProperty.call(b, c) && (this[c] = b[c])
}

function n(a, b) {
    var c = b
        , d = a[b]
        , f = d >> 4;
    d = d &= 15;
    b += 1;
    var g, h = 0, i = 1;
    do {
        if (b == a.length)
            return [null, c];
        g = a[b++];
        h += (g & 127) * i;
        i *= 128
    } while ((g & 128) !== 0);g = b + h;
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
    return [i, g]
}

function q(a, b) {
    return 256 * a[b] + a[b + 1]
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
        d += String.fromCharCode(e)
    }
    return d
}

function z(a) {
    var b;
    if (typeof a === "string" || a instanceof ArrayBuffer || a instanceof Int8Array || a instanceof Uint8Array || a instanceof Int16Array || a instanceof Uint16Array || a instanceof Int32Array || a instanceof Uint32Array || a instanceof Float32Array || a instanceof Float64Array)
        b = a;
    else
        throw j(h.INVALID_ARGUMENT, [a, "newPayload"]);
    this._getPayloadString = function() {
        if (typeof b === "string")
            return b;
        else
            return u(b, 0, b.length)
    }
    ;
    this._getPayloadBytes = function() {
        if (typeof b === "string") {
            var a = new ArrayBuffer(s(b));
            a = new Uint8Array(a);
            t(b, a, 0);
            return a
        } else
            return b
    }
    ;
    var c;
    this._getDestinationName = function() {
        return c
    }
    ;
    this._setDestinationName = function(a) {
        if (typeof a === "string")
            c = a;
        else
            throw new Error(j(h.INVALID_ARGUMENT, [a, "newDestinationName"]))
    }
    ;
    var d = 0;
    this._getQos = function() {
        return d
    }
    ;
    this._setQos = function(a) {
        if (a === 0 || a === 1 || a === 2)
            d = a;
        else
            throw new Error("Invalid argument:" + a)
    }
    ;
    var e = !1;
    this._getRetained = function() {
        return e
    }
    ;
    this._setRetained = function(a) {
        if (typeof a === "boolean")
            e = a;
        else
            throw new Error(j(h.INVALID_ARGUMENT, [a, "newRetained"]))
    }
    ;
    var f = !1;
    this._getDuplicate = function() {
        return f
    }
    ;
    this._setDuplicate = function(a) {
        f = a
    }
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
        } else if (arguments.length === 1) {
            ws = new OrigWebSocket(url);
        } else if (arguments.length >= 2) {
            ws = new OrigWebSocket(url, protocols);
        } else {
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



