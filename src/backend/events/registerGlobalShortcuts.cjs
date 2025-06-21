const { globalShortcut, app, ipcRenderer } = require("electron");

function registerGlobalShortcuts() {
  globalShortcut.unregisterAll();

  const ret = globalShortcut.register("F10", () => {
    ipcRenderer.invoke("actionsHandler-screenshot");
    console.log("F10 is pressed");
  });

  if (!ret) {
    console.log("registration failed");
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered("F10"));

  app.on("will-quit", () => globalShortcut.unregisterAll());
}

module.exports = { registerGlobalShortcuts };
