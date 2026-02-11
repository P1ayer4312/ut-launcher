import contextBridge from "@src/frontend/contextBridge/contextBridge";
import "./TitleBar.scss";
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize } from "react-icons/vsc";

export default function TitleBar() {
  const titleBarControls = contextBridge.titleBarControls;

  return (
    <div className="title-bar_wrapper">
      <div className="title-bar_draggable" onDoubleClick={() => titleBarControls.maximize()}></div>
      <div className="title-bar_controls title-bar_min" onClick={() => titleBarControls.minimize()}>
        <VscChromeMinimize />
        <div className="title-bar_blocker"></div>
      </div>
      <div className="title-bar_controls title-bar_max" onClick={() => titleBarControls.maximize()}>
        <VscChromeMaximize />
        <div className="title-bar_blocker"></div>
      </div>
      <div className="title-bar_controls title-bar_close" onClick={() => titleBarControls.close()}>
        <VscChromeClose />
        <div className="title-bar_blocker"></div>
      </div>
    </div>
  );
}
