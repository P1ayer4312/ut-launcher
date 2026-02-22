import "./BannerImgAndLogo.scss";
import { useGlobalState } from "@src/frontend/state/useGlobalState";

export default function BannerImgAndLogo() {
  const { selectedGame } = useGlobalState();

  return (
    <div className="banner-img-and-logo">
      <div className="banner-img-and-logo_center">
        <img
          draggable={false}
          className="banner-img-and-logo_hero"
          src={`./imgs/heroes/${selectedGame}-hero.jpg`}
          alt=""
        />
      </div>
      <img
        draggable={false}
        className="banner-img-and-logo_logo"
        src={`./imgs/logos/${selectedGame}-logo.png`}
        alt=""
      />
    </div>
  );
}
