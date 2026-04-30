import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import type { TGameId, TReleaseFile } from "@src/backend/types/gameConfigData.type";
import { fetchGithubReleases } from "@src/backend/utils/fetchGithubReleases";

export async function fetchPatchesForGame(gameID: TGameId): Promise<TReleaseFile[]> {
  const links = WorkerHelper.getGameLinks(gameID);
  const errorMessage = `Patches are not available for provided game id: ${gameID}`;
  if (!links.patch) {
    throw new Error(errorMessage);
  }

  switch (gameID) {
    case "unreal": {
      return fetchGithubReleases(links.patch).then((res) => {
        return res
          .map((asset) =>
            asset
              .filter((item) => {
                const name = item.fileName.toLowerCase();
                return name.includes("windows") && name.endsWith("zip") && !name.includes("windowsxp");
              })
              .map((filtered) => {
                return {
                  // Reduce the release name length
                  ...filtered,
                  releaseName: filtered.releaseName.replace("Unreal ", ""),
                };
              }),
          )
          .flat();
      });
    }

    case "ut-1999": {
      return fetchGithubReleases(links.patch).then((res) => {
        return res
          .map((asset) =>
            asset
              .filter((item) => {
                const name = item.fileName.toLowerCase();
                return name.includes("windows") && name.endsWith("zip") && !name.includes("windowsxp");
              })
              .map((filtered) => {
                return {
                  // Reduce the release name length
                  ...filtered,
                  releaseName: filtered.releaseName.replace("Unreal Tournament ", ""),
                };
              }),
          )
          .flat();
      });
    }

    case "ut-2004": {
      return [];
      // return fetchGithubReleases(links.patch).then((res) =>
      //   res.filter((item) => {
      //     return item.fileName;
      //   }),
      // );
    }

    case "ut-alpha": {
      return fetchGithubReleases(links.patch).then((res) => {
        return res.flat();
      });
    }

    default:
      throw new Error(errorMessage);
  }
}
