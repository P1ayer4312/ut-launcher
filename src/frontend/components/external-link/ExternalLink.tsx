import "./ExternalLink.scss";
import { LuExternalLink } from "react-icons/lu";
import type { CSSProperties } from "react";

type Props = {
  link: string;
  title?: string;
  style?: CSSProperties;
};

export default function ExternalLink(props: Props) {
  return (
    <a className="external-link-component" href={props.link} target="_blank" style={props.style}>
      <span>{props.title ? props.title : props.link}</span>
      <LuExternalLink />
    </a>
  );
}
