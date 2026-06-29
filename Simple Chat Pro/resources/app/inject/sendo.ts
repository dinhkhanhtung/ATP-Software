window.alert = function (message) {
    console.log('alert', message);
};

window.onload = () => {};

let intervalLoginSendo = setInterval(() => {
    let btnChat: any = document.getElementById('chat-popup');
    if (btnChat) {
        require("electron").ipcRenderer.sendToHost('logged');
        clearInterval(intervalLoginSendo);
    }
}, 2000);

require("electron").ipcRenderer.on('showChat', (event) => {
    let btnChat: any = document.getElementById('chat-popup');
    let arrDivChat = btnChat.getElementsByTagName('div');
    if (arrDivChat.length > 1) {
        arrDivChat[2].click();
        btnChat.style.width = '100%';
        btnChat.style.height = '100%';
        btnChat.style.right = '0px';
        btnChat.style.bottom = '0px';
        arrDivChat[0].style.width = '100%';
        arrDivChat[0].style.height = '100%';
        arrDivChat[1].style.width = '100%';
        arrDivChat[1].style.height = '100%';
    }
});
