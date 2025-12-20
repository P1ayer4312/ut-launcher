/**
 * @typedef {object} Props
 * @prop {string} className
 * @prop {(value: number) => void} onChange
 * @prop {number?} min
 * @prop {number?} max
 * @prop {number?} step
 * @prop {number?} value
 *
 * @param {Props} props
 * @returns
 */
export default function RangeInput(props) {
	return (
		<div className="create-server_input-range-wrapper">
			<div className="create-server_input-range-slider"></div>
			<input
				className="create-server_input-range"
				type="range"
				min={props.min}
				max={props.max}
				step={props.step}
				value={props.value}
				onChange={(event) => props.onChange?.(event.currentTarget.valueAsNumber)}
			/>
		</div>
	);
}
