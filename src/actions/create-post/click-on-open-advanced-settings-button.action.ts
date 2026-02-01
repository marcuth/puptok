import { Action } from "../../interfaces"
import { TikTokError } from "../../error"

export const clickOnOpenAdvancedSettingsButtonAction: Action<void> = async ({ logger, page, defaultTimeout }) => {
    logger.debug("Clicking on open advanced settings button")

    const openAdvancedSettingsButton = await page.waitForSelector('div[data-e2e="advanced_settings_container"]', {
        timeout: defaultTimeout,
    })

    if (!openAdvancedSettingsButton) {
        logger.error("Open advanced settings button not found")
        throw new TikTokError("Open advanced settings button not found")
    }

    await openAdvancedSettingsButton.click()

    logger.debug("Open advanced settings button clicked")
}
