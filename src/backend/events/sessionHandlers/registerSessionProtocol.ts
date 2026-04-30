import { session, net } from "electron";
import url from "node:url";

export function registerSessionProtocol(partition: string) {
  const ses = session.fromPartition(partition);

  ses.protocol.handle("ut-launcher", (request) => {
    const urlString = request.url.slice("ut-launcher://".length);
    const fileUrl = String(url.pathToFileURL(atob(urlString)));
    return net.fetch(fileUrl);
  });
}
