/**
 * 渲染进程
 */

const { ipcRenderer } = require('electron');
const Timer = require('timer.js');
const { NOTIFICATION_TYPE } = require("./utils/const");

// 创建计时器
function startWork() {
    let workTimer = new Timer({
        tick: 1,
        ontick: (ms) => {
            updateTime(ms);
        },
        onend: () => {
            notification();
        },
    });
    workTimer.start(10);
}

// 更新时间
function updateTime(ms) {
    const timerContainer = document.getElementById("timer-container");
    const s = (ms / 1000).toFixed(0);
    const ss = s % 60;
    const mm = (s / 60).toFixed(0);
    timerContainer.innerText = `${mm.toString().padStart(2, 0)}:${ss
        .toString()
        .padStart(2, 0)}`;
}

// 通知
async function notification() { 
    const res = await ipcRenderer.invoke("work-notification");
    console.log("res", res);
    switch (res) {
        case NOTIFICATION_TYPE.Rest:
            setTimeout(() => {
               alert("休息"); 
            }, 2 * 1000);
            break;
        case NOTIFICATION_TYPE.Work:
            startWork();
            break;
        default:
            throw new Error("oops,not support yet");
    }
}

startWork();