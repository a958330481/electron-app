/**
 * 渲染进程
 */

const { ipcRenderer, remote } = require('electron');
const Timer = require('timer.js');
const { NOTIFICATION_TYPE } = require('./utils/const');
const { QUERY_WIN_ID, RENDERDER_IPC } = require("./utils/events");

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
    workTimer.start(5*60);
};

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
    const res = await ipcRenderer.invoke("work-notification",1,2);
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

// 监听主进程通信
function handleMainIPC() { 
    ipcRenderer.on("ipc-to-renderer", () => { 
        alert('俺收到主进程的来信啦~')
    });
}

// 渲染进程间通信
function handleRendererIPC() { 
    const btn = document.getElementById("rendererIpc");
    const targetWinName = "win2";
    const targetWinId = ipcRenderer.sendSync(QUERY_WIN_ID, targetWinName);
    btn.onclick = () => { 
        console.log("targetWinId", targetWinId);
        ipcRenderer.sendTo(targetWinId, RENDERDER_IPC, "win1 -> win2");
    }
}

startWork();
handleMainIPC();
handleRendererIPC();