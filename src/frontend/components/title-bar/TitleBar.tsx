import "./TitleBar.scss";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import { IoIosWarning } from "react-icons/io";

export default function TitleBar() {
  const titleBarControls = contextBridge.titleBarControls;
  const actionsHandler = contextBridge.actionsHandler;
  const setPlatform = useGlobalState((e) => e.setPlatform);

  const [showTitleBar, setShowTitleBar] = useState<boolean>(false);

  useEffect(() => {
    actionsHandler.platform().then((platform) => {
      if (platform === "darwin") {
        // Disable titlebar buttons for Mac
        setShowTitleBar(false);
      } else {
        setShowTitleBar(true);
      }

      // We already pull the platform type, so we'll just pass it to the global state
      setPlatform(platform);
    });
  }, []);

  return (
    <div className="title-bar_wrapper">
      <div className="title-bar_draggable" onDoubleClick={() => titleBarControls.maximize()}></div>
      <div className="title-bar_message">
        <IoIosWarning />
        <span>Preview build expect bugs</span>
      </div>
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
