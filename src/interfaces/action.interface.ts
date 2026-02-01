import { Page } from "puppeteer"
import { Logger } from "winston"

export type ActionOptions = {
    logger: Logger
    page: Page
    defaultTimeout: number
}

export type Action<T = void> = (options: ActionOptions) => Promise<T>
