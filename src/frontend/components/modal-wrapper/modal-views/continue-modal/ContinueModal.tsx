import "./ContinueModal.scss";
import { FaKiwiBird } from "react-icons/fa";
import type { PropsWithChildren } from "react";

interface ContinueModalProps extends PropsWithChildren {
  onButtonClicked: () => void;
  buttonText?: string;
}

export default function ContinueModal(props: ContinueModalProps) {
  return (
    <div className="continue-modal_wrapper">
      <div className="continue-modal_content">{props.children}</div>
      <div className="continue-modal_button" onClick={props.onButtonClicked}>
        <FaKiwiBird />
        <span>{props.buttonText || "Continue"}</span>
      </div>
    </div>
  );
}
