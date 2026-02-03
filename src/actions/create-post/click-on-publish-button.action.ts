import { Action } from "../../interfaces"
import { TikTokError } from "../../error"
import { delay } from "../../utils"

export const clickOnPublishButtonAction: Action<void> = async ({ logger, page, defaultTimeout }) => {
    logger.debug("Clicking on publish button")

    const publishButtonSelector = "xpath///button[.//*[text()='Publicar']]"

    const publishButton = await page.waitForSelector(publishButtonSelector, {
        timeout: defaultTimeout,
    })

    if (!publishButton) {
        logger.error("Publish button not found")
        throw new TikTokError("Publish button not found")
    }

    await page.evaluate((publishButtonSelector) => {
        const publishButton = document.querySelector(publishButtonSelector)
        if (publishButton) {
            publishButton.scrollIntoView()
        }
    }, publishButtonSelector)

    await publishButton.click()

    await delay(1000)

    logger.debug("Publish button clicked")
}
