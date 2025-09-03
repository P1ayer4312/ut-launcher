/** @import { TGameId } from "../../state/useGlobalState" */
import { useState } from "react";
import { useGlobalState } from "../../state/useGlobalState";
import "./GameDescription.scss";

export default function GameDescription() {
	const { selectedGame } = useGlobalState();
	const [selectedImage, setSelectedImage] = useState(1);
	const [animationClass, setAnimationClass] = useState("show");

	function imageSwapAnimation(imgNum) {
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
					<GameText gameId={selectedGame} />
				</div>
			</div>
			<div className="game-description_right-side">
				<div className="game-description_image-container">
					<img
						className={`game-description_image-container_large-image game-description_image-container_large-image_${animationClass}`}
						src={`./imgs/game-description/${selectedGame}/${selectedImage}.webp`}
						alt=""
					/>
					<div className="game-description_image-container_panel">
						<img
							className="game-description_image-container_panel-image"
							src={`./imgs/game-description/${selectedGame}/1.webp`}
							alt=""
							onClick={() => imageSwapAnimation(1)}
						/>
						<img
							className="game-description_image-container_panel-image"
							src={`./imgs/game-description/${selectedGame}/2.webp`}
							alt=""
							onClick={() => imageSwapAnimation(2)}
						/>
						<img
							className="game-description_image-container_panel-image"
							src={`./imgs/game-description/${selectedGame}/3.webp`}
							alt=""
							onClick={() => imageSwapAnimation(3)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// TODO: Should the text be split or is it fine like this? idk

/** @param {{gameId: TGameId}} props */
function GameText(props) {
	switch (props.gameId) {
		case "unreal":
			return (
				<>
					Your prison ship has crash-landed on the fastest, sleekest, most dangerous 3D world ever created.
					Look around: crystal-clear water shimmers, shadows dance and shift, alien architecture fades into
					the horizon. Discover the secret of this mysterious planet and find out what caused a peaceful race
					to be enslaved by vicious merciless aggressors.
					<p>
						<b>Release Date:</b> May 22, 1998
					</p>
				</>
			);
		case "ut-1999":
			return (
				<>
					Step into the arena, face off with skilled opponents (bot and human alike), and put yourself to the
					test in the tournament that defined a genre. Featuring both single and multiplayer, Unreal
					Tournament featured a variety of iconic modes, like Capture the Flag, Deathmatch, Assault,
					Domination, and over 50 unique levels of battle—including a galleon ship, Egyptian tombs,
					submarines, speeding trains, space castles, and more—brought to life as works of art using the early
					Unreal Engine.
					<p>
						<b>Release Date:</b> November 30, 1999
					</p>
				</>
			);
		case "ut-2003":
			return (
				<>
					Mining companies have been running smaller matches to channel aggression, but now the Liandri Mining
					Corporation established a professional league, which quickly proves to be an extremely lucrative way
					of public entertainment. Liandri entered into the Tournament, as it is officially called, sponsoring
					their own team, the Corrupt.
					<p>
						<b>Release Date:</b> September 30, 2002
					</p>
				</>
			);
		case "ut-champs":
			return (
				<>
					It's out there: a world fueled by Adrenaline, firepower, and the will to win. Enter the
					Championship—the combat sport of the future. Face off against your rivals and, like the Gladiators
					of ancient Rome, rely on lightning-fast reflexes and the mastery of awesome weaponry to determine if
					you're a contender... or a moving target.
					<p>
						<b>Release Date:</b> November 12, 2002
					</p>
				</>
			);
		case "unreal-2":
			return (
				<>
					You are John Dalton, an ex-Marine assigned to patrol the edge of human space as a Marshal for the
					Terran Colonial Authority. Unexpectedly, your monotonous life is shattered by a chilling distress
					signal, plunging you into an adventure beyond belief. Violent turmoil among the races has erupted on
					your watch. Thrust into a conflict that will determine the fate of the galaxy, you are humanity's
					only hope for salvation. Only you can prevent the Awakening.
					<p>
						<b>Release Date:</b> February 4, 2003
					</p>
				</>
			);
		case "ut-2004":
			return (
				<>
					Unreal Tournament 2004 is a multiplayer first person shooter that combines the kill-or-be-killed
					experience of gladiatorial combat with cutting-edge technology. Ten game modes - both team-based and
					“every man for himself“ -- provide even the most hardcore gamer with palm-sweating challenges
					through unbelievably detailed indoor arenas and vast outdoor environments.
					<p>
						<b>Release Date:</b> March 16, 2004
					</p>
				</>
			);
		case "ut-champs-2":
			return (
				<>
					Unreal Championship 2: The Liandri Conflict enhances both single and multiplayer gameplay, including
					all-new player acrobatics, third-person camera mode, vehicles, and intense melee abilities. In the
					single player campaign, you'll fight your way through new cities and arenas as Anubis, who attempts
					to retake his people's Nakhti Rite of Ascension Tournament from the machinations of the Liandri
					Corporation.
					<p>
						<b>Release Date:</b> April 18, 2005
					</p>
				</>
			);
		case "ut-3":
			return (
				<>
					Unreal Tournament 3 marks the return of the world's premiere first-person shooter to the PC, and its
					debut on the PLAYSTATION 3 system. Unreal Tournament 3 unleashes the full power of Unreal Engine 3,
					taking graphics, gameplay, and challenge to a whole new level. Players engage in intense battles
					with other human players online, or against Unreal artificial intelligence that sets the industry
					standard.
					<p>
						<b>Release Date:</b> November 19, 2007
					</p>
				</>
			);
		case "ut-alpha":
			return (
				<>
					This was an early (pre-alpha) version of an Unreal Tournament experience that was canceled in
					December, 2018.
					<p>
						<b>Release Date:</b> August 13, 2014
					</p>
				</>
			);
		default:
			return <h1>MISSING_GAME_DESCRIPTION_TEXT</h1>;
	}
}
