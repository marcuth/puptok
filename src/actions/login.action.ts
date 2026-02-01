import { delay } from "../utils/delay.util"
import { Action } from "../interfaces"

export const loginAction: Action<void> = async ({ logger, page }) => {
    logger.debug("Logging in")

    await page.goto("https://www.tiktok.com/login", { waitUntil: "networkidle2" })

    while (page.url().includes("/login")) {
        logger.info("Waiting for user to log in...")
        await delay(2000)
    }

    logger.info("User logged in")
}
