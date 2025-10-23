class LinksHelper {
	/**
	 * Opens a link in a new browser window
	 * @param {string} url
	 */
	static openInBrowser(url) {
		// Check if it's a valid url
		new URL(url);
		window.open(url, "_blank");
	}
}

export default LinksHelper;
