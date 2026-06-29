window.alert = function (message) {
    console.log('alert', message);
};
window.onload = function () { };
var intervalCheckUrlBusiness = setInterval(function () {
    var cookie = document.cookie;
    var urlCurrent = document.location.href;
    if (urlCurrent.includes('business.facebook.com')) {
        clearInterval(intervalCheckUrlBusiness);
    }
    else if (cookie.includes('c_user')) {
        require("electron").ipcRenderer.sendToHost('setUrl');
        clearInterval(intervalCheckUrlBusiness);
    }
}, 2000);
