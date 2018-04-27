/**
 * Closes all empty tabs
 * @param browser - Puppeteer browser instance
 * @void
 */
export async function closeEmptyTabs({browser}) {
    const {targetInfos} = await browser._connection.send('Target.getTargets');

    await Promise.all(
        targetInfos
            .filter(({url}) => url === 'chrome://newtab/')
            .map(({targetId}) => browser._connection.send('Target.closeTarget', {targetId}))
    );
}
