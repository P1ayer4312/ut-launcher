import "./SettingsGameOptions.scss";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import { MultipleSectionsData } from "@src/backend/classes/IniHelper";
import { PropsWithChildren, useEffect, useState, type ChangeEvent } from "react";
import { BsFillFloppyFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";

export default function SettingsGameOptions() {
  // We'll keep everything for now in a single file,
  // if it gets too crazy it should be split

  const selectedGame = useGlobalState((e) => e.selectedGame);
  const [configData, setConfigData] = useState<MultipleSectionsData[] | null>(null);

  useEffect(() => {
    if (selectedGame !== "blank") {
      contextBridge.gameData.getGameConfig(selectedGame).then(setConfigData);
    }
  }, []);

  // prettier-ignore
  const displayResolutions = [
    "640x360", "640x480", "720x480", "720x576", "800x600", "854x480", "960x540", "960x720",
    "1024x576", "1024x768", "1138x640", "1152x864", "1176x664", "1280x720", "1280x768",
    "1280x800", "1280x960", "1280x1024", "1344x750", "1360x768", "1366x768", "1400x1050",
    "1440x900", "1440x1080", "1600x900", "1600x1024", "1680x1050", "1920x1080", "1920x1200",
    "2048x1080", "2560x1080", "2560x1440", "2560x1600", "3440x1440", "3840x2160"
  ];

  // ======================================================================================================

  if (selectedGame === "ut-2003") {
    let resolution = undefined;
    let fullscreen: string = "False";
    const clientData = configData?.find((item) => item.section === "WinDrv.WindowsClient");
    if (clientData) {
      const viewportX = clientData.data["WindowedViewportX"]![0];
      const viewportY = clientData.data["WindowedViewportY"]![0];

      resolution = `${viewportX}x${viewportY}`;
      fullscreen = clientData.data["StartupFullscreen"]![0];
    }

    function resolutionChange(event: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
      const selectedRes = event.currentTarget.value.split("x");
      const viewportX = [selectedRes[0]];
      const viewportY = [selectedRes[1]];

      const dataClone = structuredClone(clientData);
      if (dataClone) {
        dataClone.data["WindowedViewportX"] = viewportX;
        dataClone.data["WindowedViewportY"] = viewportY;
        dataClone.data["FullscreenViewportX"] = viewportX;
        dataClone.data["FullscreenViewportY"] = viewportY;
        dataClone.data["MenuViewportX"] = viewportX;
        dataClone.data["MenuViewportY"] = viewportY;

        setConfigData([dataClone]);
      }
    }

    function fullscreenChange(value: boolean) {
      const dataClone = structuredClone(clientData);
      if (dataClone) {
        dataClone.data["StartupFullscreen"] = [boolCast(value) as string];
        setConfigData([dataClone]);
      }
    }

    return (
      <div>
        <div className="settings-game-option_title">Game Settings</div>
        <div className="settings-game-option_input-wrapper">
          <div>Resolution</div>
          <select
            onChange={resolutionChange}
            className="settings-game-option_input settings-game-option_select"
          >
            {displayResolutions.map((item, index) => {
              return (
                <option value={item} key={index} selected={item === resolution}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        <CustomCheckbox
          id="fullscreen-ut2003"
          checked={boolCast(fullscreen) as boolean}
          onClick={fullscreenChange}
        >
          Fullscreen
        </CustomCheckbox>
        <div
          className="settings-tab_button settings-game-option_save-button"
          onClick={() => contextBridge.gameData.saveGameConfig(selectedGame, configData!)}
        >
          <BsFillFloppyFill />
          Save Settings
        </div>
      </div>
    );
  }

  // ======================================================================================================

  if (selectedGame === "ut-2004") {
    let resolution = undefined;
    let fullscreen: string = "False";
    const clientData = configData?.find((item) => item.section === "WinDrv.WindowsClient");
    if (clientData) {
      const viewportX = clientData.data["WindowedViewportX"]![0];
      const viewportY = clientData.data["WindowedViewportY"]![0];

      resolution = `${viewportX}x${viewportY}`;
      fullscreen = clientData.data["StartupFullscreen"]![0];
    }

    function resolutionChange(event: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
      const selectedRes = event.currentTarget.value.split("x");
      const viewportX = [selectedRes[0]];
      const viewportY = [selectedRes[1]];

      const dataClone = structuredClone(clientData);
      if (dataClone) {
        dataClone.data["WindowedViewportX"] = viewportX;
        dataClone.data["WindowedViewportY"] = viewportY;
        dataClone.data["FullscreenViewportX"] = viewportX;
        dataClone.data["FullscreenViewportY"] = viewportY;
        dataClone.data["MenuViewportX"] = viewportX;
        dataClone.data["MenuViewportY"] = viewportY;

        setConfigData([dataClone]);
      }
    }

    function fullscreenChange(value: boolean) {
      const dataClone = structuredClone(clientData);
      if (dataClone) {
        dataClone.data["StartupFullscreen"] = [boolCast(value) as string];
        setConfigData([dataClone]);
      }
    }

    return (
      <div>
        <div className="settings-game-option_title">Game Settings</div>
        <div className="settings-game-option_input-wrapper">
          <div>Resolution</div>
          <select
            onChange={resolutionChange}
            className="settings-game-option_input settings-game-option_select"
          >
            {displayResolutions.map((item, index) => {
              return (
                <option value={item} key={index} selected={item === resolution}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        <CustomCheckbox
          id="fullscreen-ut2004"
          checked={boolCast(fullscreen) as boolean}
          onClick={fullscreenChange}
        >
          Fullscreen
        </CustomCheckbox>
        <div
          className="settings-tab_button settings-game-option_save-button"
          onClick={() => contextBridge.gameData.saveGameConfig(selectedGame, configData!)}
        >
          <BsFillFloppyFill />
          Save Settings
        </div>
      </div>
    );
  }
}

// ======================================================================================================
// ======================================================================================================

/*
  Might need this in the future
  <div className="settings-game-option_input-wrapper">
  <div>Range</div>
  <input
    type="number"
    className="settings-game-option_input settings-game-option_input_text"
    defaultValue={30}
    onChange={(event) => {
      const target = event.currentTarget;
      const value = Number(target.value);
      if (value > 300) {
        target.value = "300";
      } else if (value < 0) {
        target.value = "0";
      }
    }}
  />
</div> */

interface CheckboxProps extends PropsWithChildren {
  id: string;
  onClick: (checked: boolean) => void;
  checked: boolean;
}

function CustomCheckbox(props: CheckboxProps) {
  return (
    <div className="settings-game-option_checkbox-wrapper">
      <input
        type="checkbox"
        id={props.id}
        hidden
        checked={props.checked}
        onChange={(event) => props.onClick(event.currentTarget.checked)}
      />
      <label className="settings-game-option_checkbox_display" htmlFor={props.id}>
        <div className="settings-game-option_checkbox_box">
          <FaCheck />
        </div>
        <span className="checkbox-text">{props.children}</span>
      </label>
    </div>
  );
}

function boolCast(value: string | boolean) {
  if (typeof value === "string") {
    if (value === "True") return true;
    if (value === "False") return false;
  }

  if (typeof value === "boolean") {
    if (value === true) return "True";
    if (value === false) return "False";
  }

  throw new Error(`Invalid value type: ${value} ${typeof value}`);
}
