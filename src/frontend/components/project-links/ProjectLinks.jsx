import "./ProjectLinks.scss";
import { FaDiscord, FaGithub } from "react-icons/fa";

export default function ProjectLinks() {
	return (
		<div className="project-links_wrapper">
			<div className="project-links_github">
				<FaGithub />
			</div>
			<div className="project-links_discord">
				<FaDiscord />
			</div>
		</div>
	);
}
