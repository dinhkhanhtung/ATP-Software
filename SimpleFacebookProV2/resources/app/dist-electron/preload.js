"use strict";var r=require("electron");r.contextBridge.exposeInMainWorld("ipcRenderer",{on(...e){let[t,n]=e;return r.ipcRenderer.on(t,(o,...i)=>n(o,...i))},off(...e){let[t,...n]=e;return r.ipcRenderer.off(t,...n)},send(...e){let[t,...n]=e;return r.ipcRenderer.send(t,...n)},invoke(...e){let[t,...n]=e;return r.ipcRenderer.invoke(t,...n)},removeAllListeners(...e){let[t,...n]=e;return r.ipcRenderer.removeAllListeners(t,...n)},once(...e){let[t,n]=e;return r.ipcRenderer.once(t,(o,...i)=>n(o,...i))}});function d(e=["complete","interactive"]){return new Promise(t=>{e.includes(document.readyState)?t(!0):document.addEventListener("readystatechange",()=>{e.includes(document.readyState)&&t(!0)})})}var a={append(e,t){if(!Array.from(e.children).find(n=>n===t))return e.appendChild(t)},remove(e,t){if(Array.from(e.children).find(n=>n===t))return e.removeChild(t)}};function c(){let e="sk-folding-cube",t=`
        .color {
            color: hsl(0 0% 9%);
            user-select: none;
        }
        .sk-folding-cube {
            margin: 20px auto;
            width: 40px;
            height: 40px;
            position: relative;
            -webkit-transform: rotateZ(45deg);
            transform: rotateZ(45deg);
        }
        .sk-folding-cube .sk-cube {
            float: left;
            width: 50%;
            height: 50%;
            position: relative;
            -webkit-transform: scale(1.1);
            -ms-transform: scale(1.1);
            transform: scale(1.1);
        }
        .sk-folding-cube .sk-cube:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: hsl(0 0% 9%);
            -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
            animation: sk-foldCubeAngle 2.4s infinite linear both;
            -webkit-transform-origin: 100% 100%;
            -ms-transform-origin: 100% 100%;
            transform-origin: 100% 100%;
        }
        .sk-folding-cube .sk-cube2 {
            -webkit-transform: scale(1.1) rotateZ(90deg);
            transform: scale(1.1) rotateZ(90deg);
        }
        .sk-folding-cube .sk-cube3 {
            -webkit-transform: scale(1.1) rotateZ(180deg);
            transform: scale(1.1) rotateZ(180deg);
        }
        .sk-folding-cube .sk-cube4 {
            -webkit-transform: scale(1.1) rotateZ(270deg);
            transform: scale(1.1) rotateZ(270deg);
        }
        .sk-folding-cube .sk-cube2:before {
            -webkit-animation-delay: 0.3s;
            animation-delay: 0.3s;
        }
        .sk-folding-cube .sk-cube3:before {
            -webkit-animation-delay: 0.6s;
            animation-delay: 0.6s;
        }
        .sk-folding-cube .sk-cube4:before {
            -webkit-animation-delay: 0.9s;
            animation-delay: 0.9s;
        }
        @-webkit-keyframes sk-foldCubeAngle {
            0%, 10% {
                -webkit-transform: perspective(140px) rotateX(-180deg);
                transform: perspective(140px) rotateX(-180deg);
                opacity: 0;
            } 25%, 75% {
                -webkit-transform: perspective(140px) rotateX(0deg);
                transform: perspective(140px) rotateX(0deg);
                opacity: 1;
            } 90%, 100% {
                -webkit-transform: perspective(140px) rotateY(180deg);
                transform: perspective(140px) rotateY(180deg);
                opacity: 0;
            }
        }

        @keyframes sk-foldCubeAngle {
            0%, 10% {
                -webkit-transform: perspective(140px) rotateX(-180deg);
                transform: perspective(140px) rotateX(-180deg);
                opacity: 0;
            } 25%, 75% {
                -webkit-transform: perspective(140px) rotateX(0deg);
                transform: perspective(140px) rotateX(0deg);
                opacity: 1;
            } 90%, 100% {
                -webkit-transform: perspective(140px) rotateY(180deg);
                transform: perspective(140px) rotateY(180deg);
                opacity: 0;
            }
        }
        .app-loading-wrap {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            z-index: 9;
        }
    `,n=document.createElement("style"),o=document.createElement("div");return n.id="app-loading-style",n.innerHTML=t,o.className="app-loading-wrap",o.innerHTML=`
        <div>
            <div class="${e}">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
            </div>
            <div class="color">Loading...</div>
        </div>
    `,{appendLoading(){a.append(document.head,n),a.append(document.body,o)},removeLoading(){a.remove(document.head,n),a.remove(document.body,o)}}}var{appendLoading:l,removeLoading:s}=c();d().then(l);window.onmessage=e=>{e.data.payload==="removeLoading"&&s()};setTimeout(s,1e3);
