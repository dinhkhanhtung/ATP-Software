window.alert = function (message) {
    console.log('alert', message);
};

window.onload = () => {};

let intervalLoginLaz = setInterval(async () => {
    let btnChat: any = document.querySelector('[data-spm="d_btn_link_chat"]');
    if (!btnChat) {
        btnChat = document.querySelector('[data-spm="d_im_icon"]');
    }
    if (btnChat) {
        require("electron").ipcRenderer.sendToHost('logged');
        clearInterval(intervalLoginLaz);
    }
    let inputAccount = document.getElementById('account');
    if (inputAccount) {
        clearInterval(intervalLoginLaz);
        await login();
    }
}, 2000);

async function login() {
    let inputUsername: any = document.getElementById('account');
    if (inputUsername) {
        inputUsername.focus();
        await sleep(500);
        require("electron").ipcRenderer.sendToHost('setUsername');
        await sleep(2000);
        let inputPassword: any = document.getElementById('password');
        if (inputPassword) {
            inputPassword.focus();
            await sleep(500);
            require("electron").ipcRenderer.sendToHost('setPassword');
            await sleep(2000);
            let btnLogin: any = document.querySelector('[data-spm="home_next"]');
            if (btnLogin) {
                btnLogin.click();
            }
        }
    }
}

async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then();
}
