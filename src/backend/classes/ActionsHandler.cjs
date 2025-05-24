/** @import { TActionsHandlerCallback } from "../types/actionsHandler.cjs" */
const { BrowserWindow } = require("electron");

/**
 * Class used for handling and displaying actions between Electron and the main world
 */
class ActionsHandler {
  constructor() {
    this.numActions = 0;
    this.actionsCounter = 0;
    this.abortController = null;
    this.running = false;
  }

  /**
   * Callback function for defining all actions
   * @param {TActionsHandlerCallback} callback
   */
  runActions(callback) {
    this.abortController = new AbortController();
    this.running = true;

    try {
      callback(this.sendMessage);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Store a reference to the BrowserWindow
   * @param {BrowserWindow} win
   */
  setWindow(win) {
    this.win = win;
  }

  stop() {
    this.abortController.abort();
  }

  sendMessage(message) {
    // TODO: Check if there is better way to target the main window
    const mainWindow = BrowserWindow.getAllWindows().find((win) => win.title === "MAIN");
    mainWindow.webContents.send("actionsHandler-message", message);
  }

  incrementActionCounter() {
    if (!this.running) {
      throw new Error("Actions stopped");
    }
    this.actionsCounter += 1;
  }

  setNumActions(value) {
    this.numActions = value;
  }
}

module.exports = ActionsHandler;
