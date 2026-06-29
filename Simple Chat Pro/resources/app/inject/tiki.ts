window.alert = function (message) {
    console.log('alert', message);
};

window.onload = () => {};

let intervalLoginTiki = setInterval(() => {
    let btnChat: any = document.getElementById('tiki-chat-platform');
    if (btnChat) {
        btnChat.click();
        let tikiChatFrame = document.getElementById('tiki-chat-service');
        if (tikiChatFrame) {
            require("electron").ipcRenderer.sendToHost('logged');
            clearInterval(intervalLoginTiki);
        }
    }
}, 2000);
require("electron").ipcRenderer.on('showChat', (event) => {
    let tikiChatFrame = document.getElementById('tiki-chat-service');
    tikiChatFrame.style.width = '100%';
    tikiChatFrame.style.height = '100%';
    tikiChatFrame.style.right = '0px';
    tikiChatFrame.style.bottom = '0px';
});

