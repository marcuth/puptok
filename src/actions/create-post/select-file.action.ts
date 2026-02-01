import { ElementHandle } from "puppeteer"

import { ActionFactory } from "../../interfaces"
import { TikTokError } from "../../error"

export const selectFileAction: ActionFactory<void> = (filePath: string) => {
    return async ({ logger, page, defaultTimeout }) => {
        logger.debug("Selecting file")

        const fileInput = (await page.waitForSelector("input[type='file']", {
            timeout: defaultTimeout,
        })) as ElementHandle<HTMLInputElement>

        if (!fileInput) {
            logger.error("File input not found")
            throw new TikTokError("File input not found")
        }

        await fileInput.uploadFile(filePath)

        await page.waitForSelector(".video-player-control", {
            timeout: defaultTimeout * 6,
        })

        logger.debug("File selected")
    }
}
