export async function resize ({page}, height, width, frame = 85) {
    await page.setViewport({height, width});

    // Window frame - probably OS and WM dependent.
    height += frame;

    // Any tab.
    const {targetInfos: [{targetId}]} = await page._client.send(
        'Target.getTargets'
    );

    // Tab window.
    const {windowId} = await page._client.send('Browser.getWindowForTarget', {
        targetId
    });

    // Actually resize.
    await page._client.send('Browser.setWindowBounds', {
        bounds: {height, width},
        windowId
    });
}
