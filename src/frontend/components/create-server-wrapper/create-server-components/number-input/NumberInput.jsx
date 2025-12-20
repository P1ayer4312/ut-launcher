import { useState } from "react";

/**
 * @typedef {object} Props
 * @prop {(value: number) => void} onBlur
 * @prop {(value: number) => void} onChange
 * @prop {number?} value
 * @prop {number?} minValue
 * @prop {number?} maxValue
 *
 * @param {Props} props
 * @returns
 */
export default function NumberInput(props) {
	const [value, setValue] = useState(Number(props.value));

	return (
		<div className="create-server_number-field">
			<input
				className="create-server_input create-server_input-number"
				onBlur={(event) => {
					const newValue = checkValue(event.currentTarget.valueAsNumber, props.minValue, props.maxValue);
					setValue(newValue);
					props.onChange?.(String(newValue));
				}}
				onChange={(event) => {
					const newValue = checkValue(event.currentTarget.valueAsNumber, props.minValue, props.maxValue);
					setValue(newValue);
					props.onChange?.(String(newValue));
				}}
				type="number"
				value={value}
			/>
			{props.text && <span>{props.text}</span>}
		</div>
	);
}

/**
 * @param {number} value
 * @param {number} minValue
 * @param {number} maxValue
 */
function checkValue(value, minValue, maxValue) {
	if (!maxValue && !minValue) {
		return value;
	}

	const currentValue = value || 0;
	if (currentValue > maxValue) {
		return maxValue;
	}

	if (currentValue < minValue) {
		return minValue;
	}

	return currentValue;
}
