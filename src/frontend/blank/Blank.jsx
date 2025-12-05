// Empty component used during development of other custom components
import CreateServerWrapper from "../components/create-server-wrapper/CreateServerWrapper";
import "./Blank.scss";

export default function Blank() {
	return (
		<>
			<div>
				<CreateServerWrapper />
			</div>
			<div style={{ position: "relative" }}>
				<img
					style={{ marginTop: "100px", position: "absolute", left: "-550px" }}
					src="\imgs\unreal1-server-create.png"
				/>
			</div>
		</>
	);
}
