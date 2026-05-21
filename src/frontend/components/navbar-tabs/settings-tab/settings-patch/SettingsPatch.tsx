import "./SettingsPatch.scss";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function SettingsPatch() {
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const setDownloadingGame = useGlobalState((e) => e.setDownloadingGame);
  if (selectedGame === "blank") {
    return null;
  }

  // Prevent api spam on view change
  const query = useQuery({
    queryKey: ["patches", selectedGame],
    queryFn: () => contextBridge.gameData.fetchPatchesForGame(selectedGame),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 600000,
    gcTime: 600000,
    retry: 1,
    retryDelay: 1000,
  });

  const [selectedPatch, setSelectedPatch] = useState<string>("");

  return (
    <div>
      <div className="patch_title">{selectedGame !== "ut-alpha" ? "OldUnreal Patches" : "UT4UU Patches"}</div>
      <select size={5} className="patch_select" onChange={(el) => setSelectedPatch(el.currentTarget.value)}>
        {query.isSuccess ? (
          query.data.map((item, index) => {
            return (
              <option key={index} value={item.url}>
                {item.releaseName}
              </option>
            );
          })
        ) : query.isError ? (
          <option value="error">Unable to fetch releases</option>
        ) : (
          <option value="loading">Loading...</option>
        )}
      </select>
      <div
        className={`settings-tab_button ${selectedPatch !== "" ? "patch_download" : ""}`}
        onClick={() => {
          if (selectedPatch === "") {
            return;
          }

          setDownloadingGame(selectedGame);
          contextBridge.gameData.downloadAndInstallPatch(selectedGame, selectedPatch);
        }}
      >
        <FaScrewdriverWrench />
        Download patch
      </div>
    </div>
  );
}
