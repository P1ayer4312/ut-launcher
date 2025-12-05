import { ImCheckmark } from "react-icons/im";
import "./CheckboxInput.scss";

/**
 * @typedef {object} Props
 * @prop {boolean} checked
 * @prop {(value: boolean) => void} onChange
 * @prop {string} text
 * @prop {"left"|"right"} textPosition
 *
 * @param {Props} props
 * @returns
 */
export default function CheckboxInput(props) {
	return (
		<label className="custom-dropdown-multi_checkbox checkbox-field">
			<div
				style={{ order: props.textPosition === "left" ? "2" : "1" }}
				className="custom-dropdown-multi_checkbox-container"
			>
				<input
					className="custom-dropdown-multi_checkbox-input"
					type="checkbox"
					onChange={(event) => props.onChange?.(event.currentTarget.checked)}
					checked={props.checked ?? undefined}
				/>
				<ImCheckmark />
			</div>
			{props.text && <span style={{ order: "1" }}>{props.text}</span>}
		</label>
	);
}
