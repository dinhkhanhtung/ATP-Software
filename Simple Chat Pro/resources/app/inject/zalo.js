"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
window.alert = function (message) {
    console.log('alert', message);
};
var clipboard = require('electron').clipboard;
var ipcRenderer = require('electron').ipcRenderer;
console.log('inject zalo');
var send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function () {
    this.addEventListener('readystatechange', function () {
        if (this.readyState === 3 && (this.responseURL.includes('chat.zalo.me/api/message/deliveredv2') || this.responseURL.includes('chat.zalo.me/api/group/deliveredv2'))) {
            if (this.responseText) {
                var json = JSON.parse(this.responseText);
                var data = json.data;
                var dataJson = data + '|zalo';
                ipcRenderer.sendToHost('receiveWS', dataJson);
            }
        }
    }, false);
    send.apply(this, arguments);
};
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
function DisplayFillter() {
    require("electron").ipcRenderer.sendToHost('CallFillTer');
}
checkLogin();
function checkLogin() {
    var intervalLoginZalo = setInterval(function () {
        try {
            var loadMore = document.getElementsByClassName('show-more-txt-new-style');
            if (loadMore.length > 0) {
                loadMore[0].click();
            }
            var classwrapper = document.querySelectorAll('div.msg-item');
            if (classwrapper.length === 0) {
                classwrapper = document.querySelectorAll('.list-friend-conctact');
            }
            if (classwrapper.length > 0) {
                require("electron").ipcRenderer.sendToHost('logged');
                clearInterval(intervalLoginZalo);
            }
        }
        catch (e) {
            console.log(e);
        }
    }, 5000);
}
function MyClick(event) {
    try {
        var classwrapperZalo = document.querySelectorAll('.list-friend-conctact');
        if (classwrapperZalo.length > 0) { //dạng danh bạ
            var bigDivData = event.target.closest(".list-friend-conctact");
            if (bigDivData !== undefined && bigDivData !== null) {
                var image = '';
                var checkImg = bigDivData.getElementsByClassName('conv-item__avatar');
                var name_1 = bigDivData.getElementsByClassName('conv-item-title__name')[0].innerText;
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
        else {
            var divInfoCustomers = event.target.closest(".msg-item"); //dạng tin nhắn
            if (event.target.closest(".msg-item")) { // each filter message of user
                if (divInfoCustomers !== undefined && divInfoCustomers !== null) {
                    var image = '';
                    var checkImg = divInfoCustomers.getElementsByClassName('conv-item__avatar');
                    var name_2 = divInfoCustomers.getElementsByClassName('conv-item-title__name')[0].innerText;
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
                    require("electron").ipcRenderer.sendToHost('sendId', name_2, UID, image, '');
                }
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}
setInterval(function () {
    require("electron").ipcRenderer.sendToHost('showCircleTagInterval');
}, 5000);
require("electron").ipcRenderer.on('showCircleTagInterval', function (event, listDataTag, uidCustomer) {
    var classwrapperZalo = document.querySelectorAll('.list-friend-conctact');
    if (classwrapperZalo.length > 0) { //dạng danh bạ
        var _loop_1 = function (j) {
            try {
                var ele = classwrapperZalo[j];
                var listTagEle = ele.querySelector('.listTag');
                var image = '';
                var checkImg = ele.getElementsByClassName('conv-item__avatar');
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
                            node_1.style.top = '47px';
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
    else {
        classwrapperZalo = document.querySelectorAll('div.msg-item'); //dạng tin nhắn
        var _loop_2 = function (j) {
            try {
                var ele = classwrapperZalo[j];
                var listTagEle = ele.getElementsByClassName('conv-item-body')[0].querySelector('.listTag');
                var checkImg = ele.getElementsByClassName('conv-item__avatar');
                if (checkImg.length > 0) {
                    var image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
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
                            var classAppendTag = ele.getElementsByClassName('conv-item-body');
                            var node_2;
                            if (classAppendTag !== undefined && classAppendTag.length > 0) {
                                node_2 = document.createElement('div');
                                node_2.style.position = 'absolute';
                                node_2.className += 'listTag';
                                node_2.style.right = '5px';
                                node_2.style.top = '47px';
                                node_2.style.display = 'flex';
                                classAppendTag[0].appendChild(node_2);
                            }
                            listDataTag.forEach(function (tag) {
                                if (tag && node_2) {
                                    node_2.innerHTML += '<div title="' + tag.name + '" class="circle-tag" id="circle' + tag.id + '" style="width: 12px; height: 12px; background-color: ' + tag.color + '; border-radius: 50%;margin-right: 2px;"></div>';
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
            _loop_2(j);
        }
    }
});
function checkDifferenceTag(arrTag, listDataTag) {
    if (arrTag.length !== listDataTag.length) {
        return true;
    }
    var _loop_3 = function (i) {
        var idTag = arrTag[i].id.split('circle')[1];
        if (idTag) {
            var tagInListData = listDataTag.find(function (tags) { return tags.id === Number(idTag); });
            if (!tagInListData) {
                return { value: true };
            }
        }
    };
    for (var i = 0; i < arrTag.length; i++) {
        var state_1 = _loop_3(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
