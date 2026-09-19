import "./GameStatusIcon.scss";
import { ImSpinner9 } from "react-icons/im";
import { IoGameController } from "react-icons/io5";

type TGameStatusIconProps = {
  status: "spinner" | "playing";
};

export default function GameStatusIcon(props: TGameStatusIconProps) {
  if (props.status === "spinner") {
    return <ImSpinner9 className="game-status-icon game-status-icon_spinner" />;
  }
  // else "playing"
  return <IoGameController className="game-status-icon game-status-icon_playing" />;
}
