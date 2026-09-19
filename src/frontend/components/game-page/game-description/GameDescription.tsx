import "./GameDescription.scss";
import { memo, useState } from "react";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import DiscordWidget from "@src/frontend/components/discord-widget/DiscordWidget";
import { openTournamentSocial } from "@src/frontend/providers/communityLinksProvider";
import { titlesData } from "@src/frontend/providers/titlesDataProvider";

const GameDescription = memo(function GameDescription() {
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const [selectedImage, setSelectedImage] = useState(1);
  const [animationClass, setAnimationClass] = useState("show");
  const titleData = titlesData[selectedGame];
  if (!titleData) {
    throw new Error(`Undefined title data: ${selectedGame}`);
  }

  function imageSwapAnimation(imgNum: number) {
    if (imgNum === selectedImage) return;

    setAnimationClass("hide");
    setTimeout(() => {
      setSelectedImage(imgNum);
      setAnimationClass("show");
    }, 210);
  }

  return (
    <div className="game-description_wrapper">
      <div className="game-description_left-side">
        <div className="game-description_left-side_text">
          <div className="game-description_left-side_title">{titleData.title}</div>
          <div>{titleData.description}</div>
          <p>
            <b>Release Date: </b>
            <span>{titleData.releaseDate}</span>
          </p>
          {selectedGame === "open-tournament" && <DiscordWidget inviteLink={openTournamentSocial.discord} />}
        </div>
      </div>
      <div className="game-description_right-side">
        <div className="game-description_image-container">
          <img
            className={`game-description_image-container_large-image game-description_image-container_large-image_${animationClass}`}
            src={`./imgs/game-description/${selectedGame}/${selectedImage}.webp`}
            alt=""
            draggable="false"
          />
          <div className="game-description_image-container_panel">
            <img
              className="game-description_image-container_panel-image"
              src={`./imgs/game-description/${selectedGame}/1.webp`}
              alt=""
              draggable="false"
              onClick={() => imageSwapAnimation(1)}
            />
            <img
              className="game-description_image-container_panel-image"
              src={`./imgs/game-description/${selectedGame}/2.webp`}
              alt=""
              draggable="false"
              onClick={() => imageSwapAnimation(2)}
            />
            <img
              className="game-description_image-container_panel-image"
              src={`./imgs/game-description/${selectedGame}/3.webp`}
              alt=""
              draggable="false"
              onClick={() => imageSwapAnimation(3)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default GameDescription;
