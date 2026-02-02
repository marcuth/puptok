import { ElementHandle } from "puppeteer"

import { ActionFactory } from "../../interfaces"
import { TikTokError } from "../../error"
import { delay } from "../../utils"

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

        let hasText = true

        await captionInput.click()

        while (hasText) {
            await captionInput.press("Backspace")

            hasText = await page.evaluate((el) => {
                const isEmpty =
                    el.innerText.trim() === "" || el.innerText.trim() === "Compartilhe mais sobre o seu vídeo aqui..."
                return !isEmpty
            }, captionInput)

            if (hasText) {
                await delay(100)
            }
        }

        await page.keyboard.type(caption)

        logger.debug("Caption put")
    }
}
