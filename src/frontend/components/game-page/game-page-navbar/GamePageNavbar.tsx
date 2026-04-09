import "./GamePageNavbar.scss";
import { memo, useEffect, type PropsWithChildren } from "react";
import { FaPlay, FaDownload, FaTimes } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { TUnreal2Type } from "@src/backend/types/gameConfigData.type";

export default function GamePageNavbar(props: PropsWithChildren) {
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const localDataStore = useGlobalState((e) => e.localDataStore);
  const setLocalDataStore = useGlobalState((e) => e.setLocalDataStore);
  const gameData = localDataStore[selectedGame];

  useEffect(() => {
    if (!gameData && selectedGame !== "blank") {
      // Pass the local game data storage to the global state, this is to avoid the
      // button flashing each time on game view change
      contextBridge.gameData.get(selectedGame).then((data) => {
        setLocalDataStore({ [selectedGame]: data });
      });
    }
  }, [gameData, localDataStore, selectedGame, setLocalDataStore]);

  return (
    <div className="game-page-navbar">
      <GameButton />
      {props.children}
    </div>
  );
}

const GameButton = memo(function GameButton() {
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const runningGame = useGlobalState((e) => e.runningGame);
  const downloadingGame = useGlobalState((e) => e.downloadingGame);
  const localDataStore = useGlobalState((e) => e.localDataStore);
  const setDownloadingGame = useGlobalState((e) => e.setDownloadingGame);
  const setLocalDataStore = useGlobalState((e) => e.setLocalDataStore);
  const platform = useGlobalState((e) => e.platform);

  const gameData = localDataStore[selectedGame];
  const isInstalled = gameData?.installed && downloadingGame === null;
  const isPlatformSupported =
    platform !== "" && localDataStore[selectedGame]?.availableOS?.includes(platform);

  function stopButtonClicked() {
    if (selectedGame === runningGame) {
      // Stop running game
      contextBridge.gameData.stopInstalledGame();
    } else if (downloadingGame !== "blank" && downloadingGame !== null) {
      // Stop the game download/install process
      contextBridge.gameData.stopGameDownload(downloadingGame).then(() => setDownloadingGame(null));
    } else {
      throw new Error("Unable to stop current game");
    }
  }

  function playButtonClicked(option?: TUnreal2Type) {
    if (selectedGame !== "blank") {
      contextBridge.gameData.startInstalledGame(selectedGame, option);
    }
  }

  function installButtonClicked() {
    contextBridge.gameData.selectInstallDir().then((data) => {
      if (data.canceled || selectedGame === "blank") {
        return;
      }

      const directoryPath = data.filePaths[0];
      setLocalDataStore({ [selectedGame]: { ...gameData, directory: directoryPath } });

      Promise.all([
        contextBridge.gameData.set(selectedGame, { directory: directoryPath }),
        contextBridge.gameData.startGameDownload(selectedGame, directoryPath),
      ]).then(() => {
        setDownloadingGame(selectedGame);
      });
    });
  }

  // Show the stop button if the game is downloading
  if (selectedGame === downloadingGame || selectedGame === runningGame) {
    return (
      <div className="game-page-navbar_action-button game-page-navbar_stop" onClick={stopButtonClicked}>
        <FaTimes />
        <span>STOP</span>
      </div>
    );
  }

  // Show the play button if the game is installed
  if (isInstalled) {
    if (selectedGame === "unreal-2") {
      // Unreal 2 has two instances for SP and MP, so we add two buttons
      return (
        <div className="game-page-navbar_unreal-2-btns">
          <div
            className="game-page-navbar_action-button game-page-navbar_play"
            onClick={() => playButtonClicked("u2-sp")}
          >
            <FaPlay />
            <span>PLAY</span>
          </div>
          <div
            className="game-page-navbar_action-button  game-page-navbar_u2-xmp"
            onClick={() => playButtonClicked("u2-xmp")}
          >
            <FaPeopleGroup />
            <span>XMP</span>
          </div>
        </div>
      );
    }

    return (
      <div
        className="game-page-navbar_action-button game-page-navbar_play"
        onClick={() => playButtonClicked()}
      >
        <FaPlay />
        <span>PLAY</span>
      </div>
    );
  }

  // Show unavailable button
  if (!isPlatformSupported) {
    return (
      <div className="game-page-navbar_action-button game-page-navbar_unavailable">
        <span>UNAVAILABLE</span>
      </div>
    );
  }

  // Show the install button if none of the check above pass
  return (
    <div className="game-page-navbar_action-button game-page-navbar_install" onClick={installButtonClicked}>
      <FaDownload />
      <span>INSTALL</span>
    </div>
  );
});
