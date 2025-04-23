import "./MenuItemGame.scss";

/**
 * Menu item cards for each game
 *
 * @typedef {object} Props
 * @prop {string} title
 * @prop {string} imgLocation
 *
 * @param {Props} props
 * @returns
 */
export default function MenuItemGame(props) {
  return (
    <div className="menu-item-game_wrapper">
      <div className="menu-item-game_drag-blocker"></div>
      <img className="menu-item-game_badge" src={props.imgLocation} />
      <h1 className="menu-item-game_title">{props.title}</h1>
    </div>
  );
}
