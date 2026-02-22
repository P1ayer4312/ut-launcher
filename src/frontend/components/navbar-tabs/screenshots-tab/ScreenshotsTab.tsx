import "./ScreenshotsTab.scss";
import { useEffect, useState } from "react";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "@firefox-devtools/react-contextmenu";

type ContextMenuCollect = {
  pathBase64: string;
  filePath: string;
};

export default function Screenshots() {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const temp = "D:/Steam/userdata/105021511/760/remote/230410/screenshots";
  useEffect(() => {
    function fetchScreenshotsForGame() {
      // TODO: Remove the temp value and add 'No screenshots' indicator
      contextBridge.actionsHandler.fetchScreenshotsFromPath(temp).then(setScreenshots);
    }

    window.addEventListener("focus", fetchScreenshotsForGame);
    fetchScreenshotsForGame();

    return () => window.removeEventListener("focus", fetchScreenshotsForGame);
  }, []);

  return (
    <div className="screenshots_wrapper">
      {screenshots.length === 0 ? (
        <div style={{ color: "red" }}>Loading...</div>
      ) : (
        screenshots.map((item, index) => {
          return <ScreenshotItem pathBase64={item} key={index} />;
        })
      )}
      <ContextMenu id="screenshot-context-menu" className="screenshots_context-menu" hideOnLeave={true}>
        <MenuItem
          onClick={(_, collect: ContextMenuCollect) => {
            contextBridge.actionsHandler.open(collect.filePath);
          }}
          className="screenshots_context-menu_item"
        >
          View
        </MenuItem>
        <MenuItem
          onClick={() => contextBridge.actionsHandler.open(temp)}
          className="screenshots_context-menu_item"
        >
          Show on disk
        </MenuItem>
        <MenuItem
          onClick={(_, collect: ContextMenuCollect) => {
            contextBridge.actionsHandler.copyImgToClipboard(collect.filePath);
          }}
          className="screenshots_context-menu_item"
        >
          Copy to clipboard
        </MenuItem>
      </ContextMenu>
    </div>
  );
}

function ScreenshotItem({ pathBase64 }: { pathBase64: string }) {
  const filePath = atob(pathBase64);
  return (
    <ContextMenuTrigger
      id="screenshot-context-menu"
      collect={function (): ContextMenuCollect {
        return { pathBase64, filePath };
      }}
    >
      <img
        onDoubleClick={() => contextBridge.actionsHandler.open(filePath)}
        className="screenshots_img"
        src={`ut-launcher://${pathBase64}`}
        loading="lazy"
      />
    </ContextMenuTrigger>
  );
}
