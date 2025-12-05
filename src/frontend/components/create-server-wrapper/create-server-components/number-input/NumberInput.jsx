/**
 * @typedef {object} Props
 * @prop {(value: number) => void} onBlur
 * @prop {(value: number) => void} onChange
 * @prop {string?} text
 *
 * @param {Props} props
 * @returns
 */
export default function NumberInput(props) {
	return (
		<div className="create-server_number-field">
			<input
				className="create-server_input create-server_input-number"
				onBlur={(event) => props.onBlur?.(event.currentTarget.valueAsNumber || 0)}
				onChange={(event) => props.onChange?.(event.currentTarget.valueAsNumber || 0)}
				type="number"
			/>
			{props.text && <span>{props.text}</span>}
		</div>
	);
}
