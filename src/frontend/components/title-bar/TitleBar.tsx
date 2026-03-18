import "./TitleBar.scss";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize } from "react-icons/vsc";
import { useEffect, useState } from "react";

export default function TitleBar() {
  const titleBarControls = contextBridge.titleBarControls;
  const actionsHandler = contextBridge.actionsHandler;

  const [showTitleBar, setShowTitleBar] = useState<boolean>(false);

  useEffect(() => {
    actionsHandler.platform().then((platform) => {
      if (platform === "darwin") {
        setShowTitleBar(false);
      } else {
        setShowTitleBar(true);
      }
    });
  }, []);

  return (
    <div className="title-bar_wrapper">
      <div className="title-bar_draggable" onDoubleClick={() => titleBarControls.maximize()}></div>
      {showTitleBar && (
        <>
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
        </>
      )}
    </div>
  );
}
