import "./DropdownMenu.scss";
import { useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";

/**
 * @typedef {{title: string, value: number | string}} Option
 *
 * @typedef {object} DropdownMenuProps
 * @prop {boolean} multiple
 * @prop {Option[]} items
 * @prop {(value: Option[]) => void} onChange Passes a list of selected options
 * @prop {(value: Option[]) => void} onInit
 * @prop {string} className
 * @prop {string?} initialValue
 */

/**
 * Custom dropdown component for handling single and multiple inputs
 * @param {DropdownMenuProps} props
 */
export default function DropdownMenu(props) {
	if (!props.items?.length) throw new Error("No items provided");

	const [dropdownOpened, setDropdownOpened] = useState(false);
	const [selected, setSelected] = useState({});

	useEffect(() => {
		const initialValue = props.multiple ? {} : initialValueCheck(props.initialValue, props.items);
		setSelected(initialValue);
		props.onInit?.();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.initialValue, props.items, props.multiple, props.items]);

	return (
		<div
			className={`custom-dropdown-multi ${props.className ?? ""}`}
			onMouseLeave={() => setDropdownOpened(false)}
		>
			<div className="custom-dropdown-multi_clickable" onClick={() => setDropdownOpened((value) => !value)}>
				<div className="custom-dropdown-multi_text">
					<span>
						{props.multiple ? `${Object.keys(selected).length} selected` : Object.keys(selected)[0]}
					</span>
				</div>
				<div className="custom-dropdown-multi_input-arrow">
					<MdArrowDropDown />
				</div>
			</div>
			{dropdownOpened && (
				<div className="custom-dropdown-multi_dropdown">
					{props.items.map((item, index) => {
						if (props.multiple) {
							return (
								<div key={index} className="custom-dropdown-multi_item custom-dropdown-multi_check">
									<label htmlFor={index} className="custom-dropdown-multi_checkbox">
										<div className="custom-dropdown-multi_checkbox-container">
											<input
												className="custom-dropdown-multi_checkbox-input"
												type="checkbox"
												id={index}
												onChange={(event) => {
													const checked = event.currentTarget.checked;

													setSelected((current) => {
														const selectedCopy = structuredClone(current);

														if (checked) {
															selectedCopy[item.title] = { title: item.title, value: item.value };
														} else {
															delete selectedCopy[item.title];
														}

														props.onChange?.(Object.values(selectedCopy));
														return selectedCopy;
													});
												}}
												checked={Boolean(selected[item.title])}
											/>
											<ImCheckmark />
										</div>
										<span>{item.title}</span>
									</label>
								</div>
							);
						}

						return (
							<div
								key={index}
								className="custom-dropdown-multi_item"
								onClick={() => {
									const selectedOption = { title: item.title, value: item.value };
									props.onChange?.([selectedOption]);
									setSelected({ [item.title]: selectedOption });
									setDropdownOpened(false);
								}}
							>
								{item.title}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

/**
 * Small helper function for setting the initial selected value
 * @param {string} value
 * @param {Option[]} items
 */
function initialValueCheck(value, items) {
	if (!value) {
		return { [items[0].title]: items[0] };
	}

	for (let item of items) {
		if (item.value === value) {
			return { [item.title]: item };
		}
	}

	throw new Error("The provided initial value does not match any item value from the list");
}
