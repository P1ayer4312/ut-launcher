import "./ScreenshotsTab.scss";
import { useEffect, useState } from "react";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "@firefox-devtools/react-contextmenu";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import type { TScreenshotData } from "@src/backend/types/customTypes.type";
import { toastPopup } from "@src/frontend/utils/toastPopup";

type ContextMenuCollect = {
  pathBase64: string;
  filePath: string;
};

export default function Screenshots() {
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const [screenshots, setScreenshots] = useState<TScreenshotData[] | null>(null);
  useEffect(() => {
    function fetchScreenshotsForGame() {
      if (selectedGame !== "blank") {
        contextBridge.actionsHandler.fetchScreenshotsForGame(selectedGame).then(setScreenshots);
      }
    }

    window.addEventListener("focus", fetchScreenshotsForGame);
    fetchScreenshotsForGame();

    return () => window.removeEventListener("focus", fetchScreenshotsForGame);
  }, []);

  return (
    <div className="screenshots_wrapper">
      {screenshots === null ? (
        <div style={{ color: "white" }}>Loading...</div>
      ) : screenshots.length === 0 ? (
        <div style={{ color: "white" }}>
          <p>No screenshots found</p>
          <p>Default screenshot key: F9</p>
        </div>
      ) : (
        screenshots.map((item, index) => {
          return <ScreenshotItem pathBase64={item.dataBase64} filePath={item.filePath} key={index} />;
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
          onClick={(_, collect: ContextMenuCollect) => {
            contextBridge.actionsHandler.showItemInFolder(collect.filePath);
          }}
          className="screenshots_context-menu_item"
        >
          Show on disk
        </MenuItem>
        <MenuItem
          onClick={(_, collect: ContextMenuCollect) => {
            contextBridge.actionsHandler.copyImgToClipboard(collect.filePath).then(() => {
              toastPopup("Copied to clipboard", "success");
            });
          }}
          className="screenshots_context-menu_item"
        >
          Copy to clipboard
        </MenuItem>
      </ContextMenu>
    </div>
  );
}

function ScreenshotItem({ pathBase64, filePath }: { pathBase64: string; filePath: string }) {
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
