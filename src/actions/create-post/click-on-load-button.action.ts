import { Action } from "../../interfaces"
import { TikTokError } from "../../error"

export const clickOnLoadButtonAction: Action<void> = async ({ logger, page, defaultTimeout }) => {
    logger.debug("Clicking on load button")

    const loadButton = await page.waitForSelector("xpath///button[.//span[text()='Carregar']]", {
        timeout: defaultTimeout,
    })

    if (!loadButton) {
        logger.error("Load button not found")
        throw new TikTokError("Load button not found")
    }

    await loadButton.click()

    logger.debug("Load button clicked")
}
