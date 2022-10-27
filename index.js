/**
 * 主进程
 */

const { app, BrowserWindow, Notification, ipcMain } = require('electron'); 
const notifier = require("node-notifier");
const { NOTIFICATION_TYPE } = require("./utils/const");

let win;

app.on('ready', () => { 
    // 窗口需要挂在全局变量，不然可能会被垃圾回收，导致窗口消失
    win = new BrowserWindow({
        width: 600,
        height: 480,
        webPreferences: {
            nodeIntegration: true, // 开启node环境
            contextIsolation: false,
        },
    });
    win.webContents.openDevTools();// 打开调试工具
    win.loadFile('./index.html');
    handleIPC();
})

// 响应通信事件
function handleIPC() { 
    ipcMain.handle("work-notification", async ()=>{ 
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
