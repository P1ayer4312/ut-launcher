// Empty component used during development of other custom components
import CreateServerWrapper from "../components/create-server-wrapper/CreateServerWrapper";
import "./Blank.scss";

export default function Blank() {
	return (
		<>
			<div>
				<CreateServerWrapper />
			</div>
			<img style={{ marginTop: "100px" }} src="\imgs\unreal1-server-create.png" />
		</>
	);
}
