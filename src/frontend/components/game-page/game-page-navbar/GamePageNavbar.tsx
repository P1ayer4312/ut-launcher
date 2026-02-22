import "./GamePageNavbar.scss";
import { useEffect, type PropsWithChildren } from "react";
import { FaPlay, FaDownload, FaTimes } from "react-icons/fa";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import contextBridge from "@src/frontend/contextBridge/contextBridge";

interface NavbarProps extends PropsWithChildren {
  /** Game is unavailable to download */
  unavailable?: boolean;
  /** Stop the current download process */
  stop?: boolean;
}

export default function GamePageNavbar(props: NavbarProps) {
  const { selectedGame, localDataStore, setLocalDataStore } = useGlobalState();
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
      <GameButton props={props} />
      {props.children}
    </div>
  );
}

function GameButton({ props }: { props: NavbarProps }) {
  const {
    selectedGame,
    runningGame,
    downloadingGame,
    localDataStore,
    setDownloadingGame,
    setLocalDataStoreForGameId,
  } = useGlobalState();

  const gameData = localDataStore[selectedGame];

  // eslint-disable-next-line react/prop-types
  const { unavailable } = props;

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

  function playButtonClicked() {
    if (selectedGame !== "blank") {
      contextBridge.gameData.startInstalledGame(selectedGame);
    }
  }

  function installButtonClicked() {
    contextBridge.gameData.selectInstallDir().then((data) => {
      if (data.canceled || selectedGame === "blank") {
        return;
      }

      const directoryPath = data.filePaths[0];
      setLocalDataStoreForGameId(selectedGame, { directory: directoryPath });

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
  if (gameData?.installed && downloadingGame === null) {
    return (
      <div className="game-page-navbar_action-button game-page-navbar_play" onClick={playButtonClicked}>
        <FaPlay />
        <span>PLAY</span>
      </div>
    );
  }

  // Show unavailable button
  if (unavailable) {
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
}
