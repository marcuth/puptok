import { Action } from "../../interfaces"
import { TikTokError } from "../../error"

export const clickOnPublishButtonAction: Action<void> = async ({ logger, page, defaultTimeout }) => {
    logger.debug("Clicking on publish button")

    const publishButton = await page.waitForSelector("xpath///button[.//*[text()='Publicar']]", {
        timeout: defaultTimeout,
    })

    if (!publishButton) {
        logger.error("Publish button not found")
        throw new TikTokError("Publish button not found")
    }

    await publishButton.click()

    logger.debug("Publish button clicked")
}
