/**
 * 主进程
 */

const { app, Notification, ipcMain } = require('electron'); 
const notifier = require('node-notifier');
const { NOTIFICATION_TYPE } = require('./utils/const');
const { createWindow,windowManager } = require('./utils/windowManager');
const { QUERY_WIN_ID } = require('./utils/events');

// 创建窗体1
function createWindowOne() { 
    createWindow({
        name: "win1",
        with: 600,
        height: 480,
        loadFileUrl: "./index.html",
        isOpenDevTools:true,
    });
}

function createWindowTwo() {
    createWindow({
        name: "win2",
        with: 600,
        height: 480,
        loadFileUrl: "./pages/win2.html",
        isOpenDevTools: true,
    });
}

app.whenReady().then(() => { 
    createWindowOne();
    createWindowTwo();
    handleIPC();
    handleQueryWindowId();
})

// 获取window ID
function handleQueryWindowId() { 
    ipcMain.on(QUERY_WIN_ID, (e, arg) => { 
        console.log("###value", windowManager.get(arg));
        e.returnValue = windowManager.get(arg);
    });
}

// 响应通信事件
function handleIPC() { 
    ipcMain.handle("work-notification", async (e, ...args) => { 
        // 获取参数
        console.log(args);
        const res = await new Promise((resolve, reject) => {
            /*
            const notification = new Notification({
                title: "任务结束",
                body: "是否开始休息",
                actions: [{ text: "开始休息", type: "button" }],
                closeButtonText: "继续工作",
            });
            notification.show();

            // 响应点击事件
            notification.on("action", () => {
                resolve(NOTIFICATION_TYPE.Rest);
            });

            // 响应关闭事件
            notification.on("close", () => {
                resolve(NOTIFICATION_TYPE.Work);
            });*/

            // notifier(支持windows)
            notifier.notify(
                {
                    title: "任务结束",
                    message: "是否开始休息?",
                    sound: true,
                    actions: ["OK", "Cancel"],
                },
                (error, response, metadata) => {
                    console.log(response, metadata);
                }
            );
            notifier.on("ok", () => {
                resolve(NOTIFICATION_TYPE.Rest);
            });
            notifier.on("cancel", () => {
                resolve(NOTIFICATION_TYPE.Work);
            });
        })
        return res;
    });
}
