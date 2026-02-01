import { ActionFactory } from "../../interfaces"
import { delay } from "../../utils/delay.util"
import { TikTokError } from "../../error"

export const putCaptionAction: ActionFactory = (caption: string) => {
    return async ({ logger, page, defaultTimeout }) => {
        logger.debug("Putting caption")

        const captionInput = await page.waitForSelector(".caption-editor", { timeout: defaultTimeout })

        if (!captionInput) {
            logger.error("Caption input not found")
            throw new TikTokError("Caption input not found")
        }

        await delay(5000)

        await captionInput.click({ count: 3 })
        await captionInput.press("Backspace")

        await page.keyboard.type(caption)

        logger.debug("Caption put")
    }
}
