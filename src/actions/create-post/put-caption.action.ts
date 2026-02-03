import { ElementHandle } from "puppeteer"

import { ActionFactory } from "../../interfaces"
import { TikTokError } from "../../error"

export const putCaptionAction: ActionFactory = (caption: string) => {
    return async ({ logger, page, defaultTimeout }) => {
        logger.debug("Putting caption")

        const captionInput = (await page.waitForSelector(".caption-editor", {
            timeout: defaultTimeout,
        })) as ElementHandle<HTMLDivElement>

        if (!captionInput) {
            logger.error("Caption input not found")
            throw new TikTokError("Caption input not found")
        }

        await captionInput.click()
        await captionInput.focus()

        await page.keyboard.down("Control")
        await page.keyboard.press("A")
        await page.keyboard.up("Control")
        await page.keyboard.press("Backspace")

        await page.keyboard.type(caption)

        logger.debug("Caption put")
    }
}
