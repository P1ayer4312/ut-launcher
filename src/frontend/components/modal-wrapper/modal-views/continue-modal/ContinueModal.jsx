/** @import { PropsWithChildren } from "react" */
import "./ContinueModal.scss";
import { FaKiwiBird } from "react-icons/fa";

/**
 * @typedef {object} ContinueModalProps
 * @prop {() => void} onContinueClicked
 *
 * @param {PropsWithChildren & ContinueModalProps} props
 */
export default function ContinueModal(props) {
	return (
		<div className="continue-modal_wrapper">
			<div className="continue-modal_content">{props.children}</div>
			<div className="continue-modal_button" onClick={props.onContinueClicked}>
				<FaKiwiBird />
				<span>Continue</span>
			</div>
		</div>
	);
}
