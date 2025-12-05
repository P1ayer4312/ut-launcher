## Registering ipc channels steps

1. Define a function inside `src\backend\preload.cjs`

```js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("titleBarControls", {
	close: () => ipcRenderer.invoke("titlebar-close"),
	minimize: () => ipcRenderer.invoke("titlebar-minimize"),
	maximize: () => ipcRenderer.invoke("titlebar-maximize"),
});
```

2. Add ipcMain handle inside `src\backend\events`

```js
const { ipcMain } = require("electron");

ipcMain.handle("titlebar-close", () => {
	/* ... */
});
ipcMain.handle("titlebar-maximize", () => {
	/* ... */
});
ipcMain.handle("titlebar-minimize", () => {
	/* ... */
});
```

3. Define a type inside `src\backend\types`

```js
/**
 * @typedef {object} TContextBridgeTitleBar
 * @prop {() => Promise<void>} close
 * @prop {() => Promise<void>} minimize
 * @prop {() => Promise<void>} maximize
 */
```

4. Include the object inside `src\frontend\contextBridge\contextBridge.js`, reference the context bridge channel from the `window` object

```js
/** @import { TContextBridgeTitleBar } from "../../backend/types/actionsHandler.cjs" */

const contextBridge = {
	/** @type {TContextBridgeTitleBar} */
	titleBarControls: window.titleBarControls ?? {},
};
```

5. Finally use the functions within React using the `src\frontend\contextBridge\contextBridge.js` import

```js
import contextBridge from "../../contextBridge/contextBridge";

export default function TitleBar() {
	const titleBarControls = contextBridge.titleBarControls;
	//...
}
```
