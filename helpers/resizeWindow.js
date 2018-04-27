/**
 * Resize viewport AND browser window
 * @param {Page} page - puppeteer page instance
 * @param {Number} [width=800] - desired width
 * @param {Number} [height=600] - desired height
 * @param {Number} [frame=85] - adjustment for window/browser frame
 * @returns {Promise<void>}
 * @see https://github.com/GoogleChrome/puppeteer/issues/1183
 */
export async function resizeWindow({page}, width = 800, height = 600, frame = 85) {
    await page.setViewport({height, width});

    // Window frame - probably OS and WM dependent.
    height += frame;

    // Any tab.
    const {targetInfos: [{targetId}]} = await page._client.send('Target.getTargets');

    // Tab window.
    const {windowId} = await page._client.send('Browser.getWindowForTarget', {targetId});

    // Actually resize.
    await page._client.send('Browser.setWindowBounds', {
        bounds: {height, width},
        windowId
    });
}
