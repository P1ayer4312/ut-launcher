import { ImCheckmark } from "react-icons/im";
import "./CheckboxInput.scss";

/**
 * @typedef {object} Props
 * @prop {boolean} checked
 * @prop {(value: "True" | "False") => void} onChange
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
					onChange={(event) => props.onChange?.(boolToString(event.currentTarget.checked))}
					checked={checkInitialValue(props.checked)}
				/>
				<ImCheckmark />
			</div>
			{props.text && <span style={{ order: "1" }}>{props.text}</span>}
		</label>
	);
}

function checkInitialValue(value) {
	if (typeof value === "boolean") {
		return value;
	}

	if (typeof value === "string") {
		if (value === "True") {
			return true;
		}

		if (value === "False") {
			return false;
		}
	}

	return false;
}

function boolToString(value) {
	return value ? "True" : "False";
}
