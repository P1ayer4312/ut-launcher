import "./TitleBar.scss";
/* global titleBarControls */

export default function TitleBar() {
  return (
    <div className="title-bar_wrapper">
      <div className="title-bar_draggable"></div>
      <div className="title-bar_controls title-bar_min" onClick={titleBarControls.minimize}>
        <img src="./imgs/title-bar/icons8-dash-50.png" />
        <div className="title-bar_blocker"></div>
      </div>
      <div className="title-bar_controls title-bar_max" onClick={titleBarControls.maximize}>
        <img src="./imgs/title-bar/icons8-square-50.png" />
        <div className="title-bar_blocker"></div>
      </div>
      <div className="title-bar_controls title-bar_close" onClick={titleBarControls.close}>
        <img src="./imgs/title-bar/icons8-close-50.png" />
        <div className="title-bar_blocker"></div>
      </div>
    </div>
  );
}
