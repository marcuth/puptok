import { Action } from "../../interfaces"

export const tryClickOnConfirmPublishAction: Action<void> = async ({ logger, page, defaultTimeout }) => {
    try {
        const publishButton = await page.waitForSelector("xpath///button[.//*[text()='Publicar agora']]", {
            timeout: defaultTimeout,
        })

        if (!publishButton) {
            logger.error("Publish button not found")
            return
        }

        await publishButton.click()
    } catch (error) {
        logger.error(error)
        throw error
    }
}
