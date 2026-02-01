import { Action } from "../interfaces"

export const needsLoginAction: Action<boolean> = async ({ logger, page, defaultTimeout }) => {
    logger.debug("Checking if needs login")

    try {
        await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: defaultTimeout })
    } catch (error) {
        logger.debug("Navigation timeout")
    }

    const needsLogin = page.url().includes("/login") || page.url().includes("/signup")

    logger.debug(`Needs login: ${needsLogin}`)

    return needsLogin
}
