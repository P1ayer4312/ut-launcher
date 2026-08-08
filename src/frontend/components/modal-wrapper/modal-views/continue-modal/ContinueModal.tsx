import "./ContinueModal.scss";
import { FaKiwiBird } from "react-icons/fa";
import type { PropsWithChildren } from "react";

interface ContinueModalProps extends PropsWithChildren {
  onButtonClicked?: () => void;
  buttonText?: string;
  showButton?: boolean;
}

export default function ContinueModal(props: ContinueModalProps) {
  const showButton = props.showButton ?? true;

  return (
    <div className="continue-modal_wrapper">
      <div className="continue-modal_content">{props.children}</div>
      {showButton && (
        <div className="continue-modal_button" onClick={props.onButtonClicked ?? undefined}>
          <FaKiwiBird />
          <span>{props.buttonText ?? "Continue"}</span>
        </div>
      )}
    </div>
  );
}
