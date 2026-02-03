import { ActionFactory } from "../../interfaces"
import { TikTokError } from "../../error"
import { delay } from "../../utils"

export type AdvancedSettings = {
    aiGeneratedContent?: boolean
}

export const selectAdvancedSettingsAction: ActionFactory = (advancedSettings: AdvancedSettings) => {
    return async ({ logger, page, defaultTimeout }) => {
        logger.debug("Selecting advanced settings")

        if (advancedSettings.aiGeneratedContent) {
            const aigcCheckbox = await page.waitForSelector(
                'div[data-e2e="aigc_container"] div.switch .Switch__root input[type="checkbox"]',
                { timeout: defaultTimeout },
            )

            if (!aigcCheckbox) {
                logger.error("AI generated content checkbox not found")
                throw new TikTokError("AI generated content checkbox not found")
            }

            await aigcCheckbox.click()

            try {
                await delay(1000)

                const aigcConfirmButton = await page.waitForSelector("xpath///button[.//*[text()='Ativar']]", {
                    timeout: defaultTimeout,
                })

                if (aigcConfirmButton) {
                    await aigcConfirmButton.click()
                }
            } catch (error) {
                logger.debug("AI generated content confirm button not found")
            }
        }

        await delay(1000)

        logger.debug("Advanced settings selected")
    }
}
