import { Action } from "../interfaces"

export const needsLoginAction: Action<boolean> = async ({ logger, page, defaultTimeout }) => {
    logger.debug("Checking if needs login")

    try {
        await page.waitForNavigation({ waitUntil: "networkidle2", timeout: defaultTimeout })
    } catch (error) {
        logger.debug("Navigation timeout")
    }

    let needsLogin = page.url().includes("/login") || page.url().includes("/signup")

    try {
        const loginText = await page.waitForSelector("xpath///*[.//*[text()='Entrar no TikTok'] or .//*[text()='Log in to TikTok']]", {
            timeout: defaultTimeout,
        })

        if (loginText) {
            needsLogin = true
        }
    } catch (error) {
        logger.debug("Login text not found")
    }

    logger.debug(`Needs login: ${needsLogin}`)

    return needsLogin
}
