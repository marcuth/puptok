import { Action } from "../../interfaces"

export const goToTiktokStudioAction: Action<void> = async ({ logger, page }) => {
    logger.debug("Going to TikTok Studio")

    await page.goto("https://www.tiktok.com/tiktokstudio/content", { waitUntil: "networkidle2" })

    logger.debug("TikTok Studio")
}
