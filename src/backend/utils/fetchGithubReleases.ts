import type { GithubReleases } from "@src/backend/types/customTypes.type";
import type { TReleaseFile } from "@src/backend/types/gameConfigData.type";
import { logger } from "@src/backend/utils/logger";
import axios from "axios";

export async function fetchGithubReleases(apiReleasesUrl: string): Promise<TReleaseFile[][]> {
  logger.info(`Fetching releases: ${apiReleasesUrl}`);

  return axios.get<GithubReleases>(apiReleasesUrl).then((res) => {
    return res.data.map((item) => {
      return item.assets.map((asset) => {
        return {
          fileName: asset.name,
          releaseName: item.name,
          url: asset.browser_download_url,
        } as TReleaseFile;
      });
    });
  });
}
