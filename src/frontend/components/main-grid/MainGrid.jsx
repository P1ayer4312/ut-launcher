import "./MainGrid.scss";

/**
 * @param {React.PropsWithChildren} props
 * @returns
 */
export default function MainGrid(props) {
	return <div className="main-grid">{props.children}</div>;
}
