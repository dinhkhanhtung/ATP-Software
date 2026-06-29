window.alert = function (message) {
    console.log('alert', message);
};
window.onload = function () { };
var intervalLoginTiki = setInterval(function () {
    var btnChat = document.getElementById('tiki-chat-platform');
    if (btnChat) {
        btnChat.click();
        var tikiChatFrame = document.getElementById('tiki-chat-service');
        if (tikiChatFrame) {
            require("electron").ipcRenderer.sendToHost('logged');
            clearInterval(intervalLoginTiki);
        }
    }
}, 2000);
require("electron").ipcRenderer.on('showChat', function (event) {
    var tikiChatFrame = document.getElementById('tiki-chat-service');
    tikiChatFrame.style.width = '100%';
    tikiChatFrame.style.height = '100%';
    tikiChatFrame.style.right = '0px';
    tikiChatFrame.style.bottom = '0px';
});
