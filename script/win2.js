const { ipcRenderer } = require("electron");
const { RENDERDER_IPC } = require("../utils/events");

ipcRenderer.on(RENDERDER_IPC, (event, arg) => {
    alert(arg);
});