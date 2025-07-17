import contextBridge from "../../contextBridge/contextBridge";
import "./TitleBar.scss";
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize } from "react-icons/vsc";

export default function TitleBar() {
	const titleBarControls = contextBridge.titleBarControls;

	return (
		<div className="title-bar_wrapper">
			<div className="title-bar_draggable" onDoubleClick={() => titleBarControls.maximize()}></div>
			<div className="title-bar_controls title-bar_min" onClick={() => titleBarControls.minimize()}>
				{/* <img src="./imgs/title-bar/icons8-dash-50.png" /> */}
				<VscChromeMinimize />
				<div className="title-bar_blocker"></div>
			</div>
			<div className="title-bar_controls title-bar_max" onClick={() => titleBarControls.maximize()}>
				{/* <img src="./imgs/title-bar/icons8-square-50.png" /> */}
				<VscChromeMaximize />
				<div className="title-bar_blocker"></div>
			</div>
			<div className="title-bar_controls title-bar_close" onClick={() => titleBarControls.close()}>
				{/* <img src="./imgs/title-bar/icons8-close-50.png" /> */}
				<VscChromeClose />
				<div className="title-bar_blocker"></div>
			</div>
		</div>
	);
}
