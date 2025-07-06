const { session, net } = require("electron");
const url = require("node:url");

/** @param {string} partition */
function registerSessionProtocol(partition) {
	const ses = session.fromPartition(partition);

	ses.protocol.handle("ut-launcher", (request) => {
		const urlString = request.url.slice("ut-launcher://".length);
		return net.fetch(url.pathToFileURL(atob(urlString)));
	});
}

module.exports = { registerSessionProtocol };
