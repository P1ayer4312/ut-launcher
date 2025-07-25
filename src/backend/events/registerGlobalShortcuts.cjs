const { globalShortcut, app } = require("electron");
const { Window } = require("node-screenshots");
const actionsHandler = require("../handlers/actionsHandler.cjs");
const fs = require("node:fs");

function registerGlobalShortcuts() {
	globalShortcut.unregisterAll();

	globalShortcut.register("F11", () => {
		const allWindows = Window.all();

		// allWindows.forEach((item) => {
		// 	console.log(
		// 		item.appName,
		// 		item.height,
		// 		item.width,
		// 		item.id,
		// 		item.isMaximized,
		// 		item.isMinimized,
		// 		item.title,
		// 		item.x,
		// 		item.y
		// 	);
		// });

		const ut1999 = allWindows.find(
			(item) => item.appName == "UnrealTournament.exe" || item.title == "Unreal Tournament"
		);

		// [electron] UnrealTournament.exe 28 160 329814 false true Unreal Tournament -32000 -32000

		fs.writeFileSync("./mc.png", ut1999.captureImageSync().toPngSync());
		actionsHandler.sendMessage("screenshot", true);
	});

	app.on("will-quit", () => globalShortcut.unregisterAll());
}

module.exports = { registerGlobalShortcuts };
