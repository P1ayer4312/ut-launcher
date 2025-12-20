/**
 * @typedef {object} Props
 * @prop {(value: string) => void} onBlur
 * @prop {(value: string) => void} onChange
 * @prop {string?} value
 * @prop {string} className
 *
 * @param {Props} props
 * @returns
 */
export default function TextInput(props) {
	return (
		<input
			type="text"
			className={`create-server_input ${props.className ?? ""}`}
			onBlur={(event) => props.onBlur?.(event.currentTarget.value || "")}
			onChange={(event) => props.onChange?.(event.currentTarget.value || "")}
			value={props.value ?? ""}
		/>
	);
}
