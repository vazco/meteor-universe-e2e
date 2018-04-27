/**
 * Send a sequence of key strokes to an element (clears value before)
 * @param page
 * @param selector
 * @param value
 */
export async function setValue({page}, selector, value) {
    const elementHandle = await page.$(selector);

    await elementHandle.focus();
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await elementHandle.type(value, {delay: 0});
    await elementHandle.dispose();
}
