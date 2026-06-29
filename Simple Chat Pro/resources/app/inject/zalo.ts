import Friend from "../src/models/friend";

window.alert = function (message) {
    console.log('alert', message);
};

let clipboard = require('electron').clipboard;
let ipcRenderer = require('electron').ipcRenderer;
let listAllFriendZalo: Array<any> = new Array<any>();

console.log('inject zalo');

var send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function () {
    this.addEventListener('readystatechange', function () {
        if (this.readyState === 3 && (this.responseURL.includes('chat.zalo.me/api/message/deliveredv2') || this.responseURL.includes('chat.zalo.me/api/group/deliveredv2'))) {
            if (this.responseText) {
                let json = JSON.parse(this.responseText);
                let data = json.data;
                let dataJson = data + '|zalo';
                ipcRenderer.sendToHost('receiveWS', dataJson);
            }
        }
    }, false);
    send.apply(this, arguments);
};

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
    } else {// Start Fillter giao diện cũ
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
    let classwrapperZalo = document.querySelectorAll("div[data-id='div_TabCT_FrdItem']");
    if (classwrapperZalo.length > 0) {//dạng danh bạ
        let ele;
        let uid;
        for (let j = 0; j < classwrapperZalo.length; j++) {
            try {
                ele = classwrapperZalo[j];
                let image = '';
                let name = '';
                let birhtday: string = '';
                let checkImg = ele.getElementsByClassName('zl-avatar__photo');
                if (checkImg.length > 0) {
                    image = checkImg[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            name = listAllFriendZalo[i]._name;
                            birhtday = listAllFriendZalo[i]._dob;
                            require("electron").ipcRenderer.sendToHost('sendId', name, uid, image, birhtday);
                            return
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    } else {
        classwrapperZalo = document.querySelectorAll('div.msg-item');//dạng tin nhắn
        let ele;
        let uid;
        for (let j = 0; j < classwrapperZalo.length; j++) {
            try {
                ele = classwrapperZalo[j];
                let image = '';
                let name = '';
                let birhtday: string = '';
                let checkImg = ele.getElementsByClassName('zl-avatar__photo');
                if (checkImg.length > 0) {
                    image = checkImg[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            name = listAllFriendZalo[i]._name;
                            birhtday = listAllFriendZalo[i]._dob;
                            require("electron").ipcRenderer.sendToHost('sendId', name, uid, image, birhtday);
                            return
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
};

function sendListUIDGetColorTag() {
    let listUID = [];
    let classwrapperZalo = document.querySelectorAll("div[data-id='div_TabCT_FrdItem']");
    if (classwrapperZalo.length > 0) {//dạng danh bạ
        let ele;
        let uid;
        let lengthTag;
        for (let j = 0; j < classwrapperZalo.length; j++) {
            try {
                ele = classwrapperZalo[j];
                lengthTag = ele.getElementsByClassName('conv-item conv-rel  ')[0].querySelector('.listTag');
                let image = '';
                let checkImg = ele.getElementsByClassName('conv-item__avatar');
                let checkName = ele.getElementsByClassName('conv-item-title__name')[0].innerText;
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if (listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            listUID.push(uid);
                            break;
                        } else {
                            if (listAllFriendZalo[i]._type === 'group') {
                                if (listAllFriendZalo[i]._name === checkName) {
                                    uid = listAllFriendZalo[i]._id;
                                    listUID.push(uid);
                                    break;
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    } else {
        classwrapperZalo = document.querySelectorAll('div.msg-item');//dạng tin nhắn
        let ele;
        let uid;
        let lengthTag;
        for (let j = 0; j < classwrapperZalo.length; j++) {
            try {
                ele = classwrapperZalo[j];
                lengthTag = ele.getElementsByClassName('conv-item-body')[0].querySelector('.listTag');
                let image = '';
                let checkImg = ele.getElementsByClassName('conv-item__avatar');
                let checkName = ele.getElementsByClassName('conv-item-title__name')[0].innerText;
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            listUID.push(uid);
                            break;
                        } else {
                            if (listAllFriendZalo[i]._type === 'group') {
                                if (listAllFriendZalo[i]._name === checkName) {
                                    uid = listAllFriendZalo[i]._id;
                                    listUID.push(uid);
                                    break;
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    require("electron").ipcRenderer.sendToHost('sendListId', listUID);
}

function RemovePanelProfile() {
    let loadMore: any = document.getElementsByClassName('show-more-txt-new-style');
    if (loadMore.length > 0) {
        loadMore[0].click();
    }
    require("electron").ipcRenderer.sendToHost('ResizeWebview');
    checkLogin();
}

require("electron").ipcRenderer.on('addListFriends', (event, listAllFriend: Array<Friend>) => {
    listAllFriendZalo = listAllFriendZalo.concat(listAllFriend);
});

require("electron").ipcRenderer.on('RemovePanelProfile', (event) => {
    RemovePanelProfile();
});

require("electron").ipcRenderer.on('onBeforeSendHeaders', (event) => {
   console.log(event);
});

require("electron").ipcRenderer.on('showCircleTag', (event, listdata, listUID) => {
    try {
        let classwrapperZalo = document.querySelectorAll("div[data-id='div_TabCT_FrdItem']");
        if (classwrapperZalo.length > 0) {//dạng danh bạ
            let ele;
            let uid;
            let lengthTag;
            for (let j = 0; j < classwrapperZalo.length; j++) {
                try {
                    ele = classwrapperZalo[j];
                    lengthTag = ele.getElementsByClassName('conv-item conv-rel  ')[0].querySelector('.listTag');
                    let image = '';
                    let checkImg = ele.getElementsByClassName('conv-item__avatar');
                    let checkName = ele.getElementsByClassName('conv-item-title__name')[0].innerText;
                    if (checkImg.length > 0) {
                        image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                        if (!image.includes('https')) {
                            image = 'https:' + image;
                        }
                        let checkId = image.split('/').length;
                        let id = image.split('/')[checkId - 1];
                        let avatar = id.split('.')[0];
                        for (let i = 0; listAllFriendZalo.length; i++) {
                            if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                                uid = listAllFriendZalo[i]._id;
                                break;
                            } else {
                                if (listAllFriendZalo[i]._type === 'group') {
                                    if (listAllFriendZalo[i]._name === checkName) {
                                        uid = listAllFriendZalo[i]._id;
                                        break;
                                    }
                                }
                            }
                        }
                        if (listUID === uid) {
                            if (listdata !== '' && listdata !== undefined && listdata !== null) {
                                let classAppendTag = ele.getElementsByClassName('conv-item-body');
                                let node;
                                if (classAppendTag !== undefined && classAppendTag.length > 0) {
                                    node = document.createElement('div');
                                    node.style.position = 'absolute';
                                    node.style.right = '5px';
                                    node.style.top = '47px';
                                    classAppendTag[0].appendChild(node);
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
                } catch (e) {
                    console.log(e);
                }
            }
        } else {
            let classwrapper = document.querySelectorAll('div.msg-item');
            let child = document.getElementsByClassName('listTag');
            for (let j = 0; j < child.length; j++) {
                child[j].remove();
            }
            let ele;
            let uid;
            for (let j = 0; j < classwrapper.length; j++) {
                try {
                    ele = classwrapper[j];
                    let image = '';
                    let checkImg = ele.getElementsByClassName('conv-item__avatar');
                    let checkName = ele.getElementsByClassName('conv-item-title__name')[0].innerText;
                    if (checkImg.length > 0) {
                        image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                        if (!image.includes('https')) {
                            image = 'https:' + image;
                        }
                        let checkId = image.split('/').length;
                        let id = image.split('/')[checkId - 1];
                        let avatar = id.split('.')[0];
                        for (let i = 0; listAllFriendZalo.length; i++) {
                            if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                                uid = listAllFriendZalo[i]._id;
                                break;
                            } else {
                                if (listAllFriendZalo[i]._type === 'group') {
                                    if (listAllFriendZalo[i]._name === checkName) {
                                        uid = listAllFriendZalo[i]._id;
                                        break;
                                    }
                                }
                            }
                        }
                        if (listUID === uid) {
                            if (listdata !== '' && listdata !== undefined && listdata !== null) {
                                let classAppendTag = ele.getElementsByClassName('conv-item-body');
                                let node;
                                if (classAppendTag !== undefined && classAppendTag.length > 0) {
                                    node = document.createElement('div');
                                    node.style.position = 'absolute';
                                    node.style.right = '5px';
                                    node.style.top = '47px';
                                    classAppendTag[0].appendChild(node);
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
                } catch (e) {
                    console.log(e);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
});

require("electron").ipcRenderer.on('setTemplate', (event, content) => {
    clipboard.writeText(content + "\r\n", 'selection');
    let textareaMessenger: any = document.getElementsByClassName('rich-input empty');
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

async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then();
}

function checkLogin() {
    let intervalLoginZalo = setInterval(() => {
        let classwrapper: any = document.querySelectorAll('div.msg-item');
        if (classwrapper.length === 0) {
            classwrapper = document.querySelectorAll("div[data-id='div_TabCT_FrdItem']");
        }
        if (classwrapper.length > 0) {
            require("electron").ipcRenderer.sendToHost('logged');
            clearInterval(intervalLoginZalo);
        }
    }, 5000);
}


let intervalZalo = setInterval(() => {
    require("electron").ipcRenderer.sendToHost('showCircleTagInterval');
}, 5000);

require("electron").ipcRenderer.on('showCircleTagInterval', (event, listdata, listUID) => {
    let classwrapperZalo = document.querySelectorAll("div[data-id='div_TabCT_FrdItem']");
    if (classwrapperZalo.length > 0) {//dạng danh bạ
        let ele;
        let uid;
        let lengthTag;
        for (let j = 0; j < classwrapperZalo.length; j++) {
            try {
                ele = classwrapperZalo[j];
                lengthTag = ele.getElementsByClassName('conv-item conv-rel  ')[0].querySelector('.listTag');
                let image = '';
                let checkImg = ele.getElementsByClassName('conv-item__avatar');
                let checkName = ele.getElementsByClassName('conv-item-title__name')[0].innerText;
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            break;
                        } else {
                            if (listAllFriendZalo[i]._type === 'group') {
                                if (listAllFriendZalo[i]._name === checkName) {
                                    uid = listAllFriendZalo[i]._id;
                                    break;
                                }
                            }
                        }
                    }
                    if ((listUID === uid) && (lengthTag === null || lengthTag === undefined)) {
                        if (listdata !== '' && listdata !== undefined && listdata !== null) {
                            let classAppendTag = ele.getElementsByClassName('conv-item conv-rel  ');
                            let node;
                            if (classAppendTag !== undefined && classAppendTag.length > 0) {
                                node = document.createElement('div');
                                node.style.position = 'absolute';
                                node.className += 'listTag';
                                node.style.right = '5px';
                                node.style.top = '47px';
                                classAppendTag[0].appendChild(node);
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
            } catch (e) {
                console.log(e);
            }
        }
    } else {
        classwrapperZalo = document.querySelectorAll('div.msg-item');//dạng tin nhắn
        let ele;
        let uid;
        let lengthTag;
        for (let j = 0; j < classwrapperZalo.length; j++) {
            try {
                ele = classwrapperZalo[j];
                lengthTag = ele.getElementsByClassName('conv-item-body')[0].querySelector('.listTag');
                let image = '';
                let checkImg = ele.getElementsByClassName('conv-item__avatar');
                let checkName = ele.getElementsByClassName('conv-item-title__name')[0].innerText;
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            break;
                        } else {
                            if (listAllFriendZalo[i]._type === 'group') {
                                if (listAllFriendZalo[i]._name === checkName) {
                                    uid = listAllFriendZalo[i]._id;
                                    break;
                                }
                            }
                        }
                    }
                    if ((listUID === uid) && (lengthTag === null || lengthTag === undefined)) {
                        if (listdata !== '' && listdata !== undefined && listdata !== null) {
                            let classAppendTag = ele.getElementsByClassName('conv-item-body');
                            let node;
                            if (classAppendTag !== undefined && classAppendTag.length > 0) {
                                node = document.createElement('div');
                                node.style.position = 'absolute';
                                node.className += 'listTag';
                                node.style.right = '5px';
                                node.style.top = '47px';
                                classAppendTag[0].appendChild(node);
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
            } catch (e) {
                console.log(e);
            }
        }
    }
});

function MyClick(event) {
    try {
        let classwrapperZalo = document.querySelectorAll("div[data-id='div_TabCT_FrdItem']");
        if (classwrapperZalo.length > 0) {//dạng danh bạ
            let bigDivData = event.target.closest("div[data-id='div_TabCT_FrdItem']");
            if (bigDivData !== undefined && bigDivData !== null) {
                let image: string = '';
                let name: string = '';
                let uid: string = '';
                let birhtday: string = '';
                let checkImg = bigDivData.getElementsByClassName('conv-item__avatar');
                let checkName = bigDivData.getElementsByClassName('conv-item-title__name')[0].innerText;
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                }
                let checkId = image.split('/').length;
                let id = image.split('/')[checkId - 1];
                let avatar = id.split('.')[0];
                for (let i = 0; listAllFriendZalo.length; i++) {
                    if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                        uid = listAllFriendZalo[i]._id;
                        birhtday = listAllFriendZalo[i]._dob;
                        name = listAllFriendZalo[i]._name;
                        console.log('vào 5 : ' + name, id, avatar);
                        require("electron").ipcRenderer.sendToHost('removeTag');
                        if (uid) {
                            require("electron").ipcRenderer.sendToHost('removePanel', '');
                        }
                        require("electron").ipcRenderer.sendToHost('sendId', name, uid, image, birhtday);
                        return;
                    } else {
                        if (listAllFriendZalo[i]._type === 'group') {
                            if (listAllFriendZalo[i]._name === checkName) {
                                uid = listAllFriendZalo[i]._id;
                                birhtday = listAllFriendZalo[i]._dob;
                                name = listAllFriendZalo[i]._name;
                                console.log('vào 5 : ' + name, id, avatar);
                                require("electron").ipcRenderer.sendToHost('removeTag');
                                if (uid) {
                                    require("electron").ipcRenderer.sendToHost('removePanel', '');
                                }
                                require("electron").ipcRenderer.sendToHost('sendId', name, uid, image, birhtday);
                                return;
                            }
                        }
                    }
                }
            }
        } else {
            let divInfoCustomers = event.target.closest(".msg-item");//dạng tin nhắn
            if (event.target.closest(".msg-item")) { // each filter message of user
                if (divInfoCustomers !== undefined && divInfoCustomers !== null) {
                    let image: string = '';
                    let name: string = '';
                    let uid: string = '';
                    let birthday: string = '';
                    let checkImg = divInfoCustomers.getElementsByClassName('conv-item__avatar');
                    let checkName = divInfoCustomers.getElementsByClassName('conv-item-title__name')[0].innerText;
                    if (checkImg.length > 0) {
                        image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                        if (!image.includes('https')) {
                            image = 'https:' + image;
                        }
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    console.log('vào ava : ' + avatar);
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            birthday = listAllFriendZalo[i]._dob;
                            name = listAllFriendZalo[i]._name;
                            require("electron").ipcRenderer.sendToHost('removeTag');
                            if (uid) {
                                require("electron").ipcRenderer.sendToHost('removePanel', '');
                            }
                            require("electron").ipcRenderer.sendToHost('sendId', name, uid, image, birthday);
                            return;
                        } else {
                            if (listAllFriendZalo[i]._type === 'group') {
                                if (listAllFriendZalo[i]._name === checkName) {
                                    uid = listAllFriendZalo[i]._id;
                                    birthday = listAllFriendZalo[i]._dob;
                                    name = listAllFriendZalo[i]._name;
                                    require("electron").ipcRenderer.sendToHost('removeTag');
                                    if (uid) {
                                        require("electron").ipcRenderer.sendToHost('removePanel', '');
                                    }
                                    require("electron").ipcRenderer.sendToHost('sendId', name, uid, image, birthday);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
}

require("electron").ipcRenderer.on('ChangeTag', (event, tags, uidCustomer) => {
    let classwrapperZalo = document.querySelectorAll("div[data-id='div_TabCT_FrdItem']");
    if (classwrapperZalo.length > 0) { //dạng danh bạ
        let ele;
        let uid;
        let child = document.getElementsByClassName('listTag');
        if (child.length > 0) {
            for (let j = 0; j < child.length; j++) {
                child[j].remove();
            }
        }
        for (let j = 0; j < classwrapperZalo.length; j++) {
            try {
                ele = classwrapperZalo[j];
                let image = '';
                let checkImg = ele.getElementsByClassName('conv-item__avatar');
                let checkName = ele.getElementsByClassName('conv-item-title__name')[0].innerText;
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            break;
                        } else {
                            if (listAllFriendZalo[i]._type === 'group') {
                                if (listAllFriendZalo[i]._name === checkName) {
                                    uid = listAllFriendZalo[i]._id;
                                    break;
                                }
                            }
                        }
                    }
                    if (uidCustomer === uid) {
                        let classAppendTag = ele.getElementsByClassName('conv-item conv-rel  ');
                        let node;
                        if (classAppendTag !== undefined && classAppendTag.length > 0) {
                            node = document.createElement('div');
                            node.style.position = 'absolute';
                            node.style.right = '5px';
                            node.style.top = '47px';
                            classAppendTag[0].appendChild(node);
                        }
                        tags.forEach(element => {
                            node.innerHTML += '<svg class="tooltip" id="tag-svg" height="12" width="12" ><circle id="circle" cx = "7" cy = "7" r = "5"  fill ="' + element.color + '">' + '</svg>';
                        });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    } else {
        classwrapperZalo = document.querySelectorAll('div.msg-item');//dạng tin nhắn
        let ele;
        let uid;
        let child = document.getElementsByClassName('listTag');
        if (child.length > 0) {
            for (let j = 0; j < child.length; j++) {
                child[j].remove();
            }
        }
        for (let j = 0; j < classwrapperZalo.length; j++) {
            try {
                ele = classwrapperZalo[j];
                let image = '';
                let checkImg = ele.getElementsByClassName('conv-item__avatar');
                let checkName = ele.getElementsByClassName('conv-item-title__name')[0].innerText;
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            break;
                        } else {
                            if (listAllFriendZalo[i]._type === 'group') {
                                if (listAllFriendZalo[i]._name === checkName) {
                                    uid = listAllFriendZalo[i]._id;
                                    break;
                                }
                            }
                        }
                    }
                    if (uidCustomer === uid) {
                        let classAppendTag = ele.getElementsByClassName('conv-item-body');
                        let node;
                        if (classAppendTag !== undefined && classAppendTag.length > 0) {
                            node = document.createElement('div');
                            node.style.position = 'absolute';
                            node.style.right = '5px';
                            node.style.top = '47px';
                            classAppendTag[0].appendChild(node);
                        }
                        tags.forEach(element => {
                            node.innerHTML += '<svg class="tooltip" id="tag-svg" height="12" width="12" ><circle id="circle" cx = "7" cy = "7" r = "5"  fill ="' + element.color + '">' + '</svg>';
                        })
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    require("electron").ipcRenderer.sendToHost('removeTag')
});


require("electron").ipcRenderer.on('updateTag', (event, tags, uidCustomer) => {
    let classwrapperZalo = document.querySelectorAll("div[data-id='div_TabCT_FrdItem']");
    if (classwrapperZalo.length > 0) {
        let ele;
        let uid;
        for (let j = 0; j < classwrapperZalo.length; j++) {
            try {
                ele = classwrapperZalo[j];
                let image = '';
                let checkImg = ele.getElementsByClassName('conv-item__avatar');
                let checkName = ele.getElementsByClassName('conv-item-title__name')[0].innerText;
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            break;
                        } else {
                            if (listAllFriendZalo[i]._type === 'group') {
                                if (listAllFriendZalo[i]._name === checkName) {
                                    uid = listAllFriendZalo[i]._id;
                                    break;
                                }
                            }
                        }
                    }
                    if (uidCustomer === uid) {
                        let eleTag = ele.getElementsByClassName('tooltip');
                        if (eleTag.length !== 0) {
                            Array.prototype.slice.call(eleTag).forEach(function (key) {
                                key.remove();
                            });
                        }
                        let classAppendTag = ele.getElementsByClassName('conv-item conv-rel  ');
                        let node;
                        if (classAppendTag !== undefined && classAppendTag.length > 0) {
                            node = document.createElement('div');
                            node.style.position = 'absolute';
                            node.style.right = '5px';
                            node.style.top = '47px';
                            classAppendTag[0].appendChild(node);
                        }
                        tags.forEach(element => {
                            node.innerHTML += '<svg class="tooltip" id="tag-svg" height="12" width="12" ><circle id="circle" cx = "7" cy = "7" r = "5"  fill ="' + element.color + '">' + '</svg>';
                        });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    } else {
        classwrapperZalo = document.querySelectorAll('div.msg-item');
        let ele;
        let uid;
        let child = document.getElementsByClassName('listTag');
        for (let j = 0; j < child.length; j++) {
            child[j].remove();
        }
        for (let j = 0; j < classwrapperZalo.length; j++) {
            try {
                ele = classwrapperZalo[j];
                let image = '';
                let checkImg = ele.getElementsByClassName('conv-item__avatar');
                let checkName = ele.getElementsByClassName('conv-item-title__name')[0].innerText;
                if (checkImg.length > 0) {
                    image = checkImg[0].getElementsByTagName('img')[0].getAttribute('src');
                    if (!image.includes('https')) {
                        image = 'https:' + image;
                    }
                    let checkId = image.split('/').length;
                    let id = image.split('/')[checkId - 1];
                    let avatar = id.split('.')[0];
                    for (let i = 0; listAllFriendZalo.length; i++) {
                        if ( listAllFriendZalo[i]._avatar === avatar && checkImg.length < 2) {
                            uid = listAllFriendZalo[i]._id;
                            break;
                        } else {
                            if (listAllFriendZalo[i]._type === 'group') {
                                if (listAllFriendZalo[i]._name === checkName) {
                                    uid = listAllFriendZalo[i]._id;
                                    break;
                                }
                            }
                        }
                    }
                    if (uidCustomer === uid) {
                        let eleTag = ele.getElementsByClassName('tooltip');
                        if (eleTag.length !== 0) {
                            Array.prototype.slice.call(eleTag).forEach(function (key) {
                                key.remove();
                            });
                        }
                        let classAppendTag = ele.getElementsByClassName('conv-item-body');
                        let node;
                        if (classAppendTag !== undefined && classAppendTag.length > 0) {
                            node = document.createElement('div');
                            node.style.position = 'absolute';
                            node.style.right = '5px';
                            node.style.top = '47px';
                            classAppendTag[0].appendChild(node);
                        }
                        tags.forEach(element => {
                            node.innerHTML += '<svg class="tooltip" id="tag-svg" height="12" width="12" ><circle id="circle" cx = "7" cy = "7" r = "5"  fill ="' + element.color + '">' + '</svg>';
                        });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    require("electron").ipcRenderer.sendToHost('removeTag')
});

