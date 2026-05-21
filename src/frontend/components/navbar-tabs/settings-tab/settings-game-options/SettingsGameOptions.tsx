import "./SettingsGameOptions.scss";
import { BsFillFloppyFill } from "react-icons/bs";

export default function SettingsGameOptions() {
  // prettier-ignore
  const displayResolutions = [
    "640x360", "640x480", "720x480", "720x576", "800x600", "854x480", "960x540", "960x720",
    "1024x576", "1024x768", "1138x640", "1152x864", "1176x664", "1280x720", "1280x768",
    "1280x800", "1280x960", "1280x1024", "1344x750", "1360x768", "1366x768", "1400x1050",
    "1440x900", "1440x1080", "1600x900", "1600x1024", "1680x1050", "1920x1080", "1920x1200",
    "2048x1080", "2560x1080", "2560x1440", "2560x1600", "3440x1440", "3840x2160"
  ];

  return (
    <div>
      <div className="settings-game-option_title">Game Settings</div>

      <div className="settings-game-option_input-wrapper">
        <div>Resolution</div>
        <select className="settings-game-option_input settings-game-option_select">
          {displayResolutions.map((item, index) => {
            return (
              <option value={item} key={index}>
                {item}
              </option>
            );
          })}
        </select>
      </div>

      <div className="settings-game-option_input-wrapper">
        <div>Max FPS</div>
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
      </div>
      <div className="settings-tab_button settings-game-option_save-button">
        <BsFillFloppyFill />
        Save Settings
      </div>
    </div>
  );
}
