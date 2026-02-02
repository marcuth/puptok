import StealthPlugin from "puppeteer-extra-plugin-stealth"
import { PuppeteerExtra } from "puppeteer-extra"
import { Browser } from "puppeteer"
import { Logger } from "winston"

import {
    goToTiktokStudioAction,
    clickOnLoadButtonAction,
    selectFileAction,
    putCaptionAction,
    clickOnOpenAdvancedSettingsButtonAction,
    selectAdvancedSettingsAction,
    AdvancedSettings,
    clickOnPublishButtonAction,
    tryClickOnConfirmPublishAction,
} from "./actions/create-post"
import { needsLoginAction } from "./actions/needs-login.action"
import { createLogger } from "./helpers/logger.helper"
import { loginAction } from "./actions/login.action"
import { requireVanillaPuppeteer } from "./utils"
import { Action } from "./interfaces"
import path from "node:path"
import fs from "node:fs"

export const defaultTimeout = 10_000

export type CreateTikTokOptions = {
    puppeteer: {
        executablePath?: string
        userDataDir: string
        extraArgs?: string[]
    }
    logLevel?: "debug" | "info" | "warn" | "error"
    screenshotOnError?: boolean
    htmlContentOnError?: boolean
    defaultTimeout?: number
}

export type TikTokOptions = {
    browser: Browser
    logLevel: "debug" | "info" | "warn" | "error"
    screenshotOnError: boolean
    htmlContentOnError: boolean
    defaultTimeout?: number
}

export type CreatePostOptions = {
    filePath: string
    caption: string
    advancedSettings?: AdvancedSettings
}

export class TikTok {
    readonly baseUrl = "https://www.tiktok.com"
    private readonly browser: Browser
    readonly logLevel: "debug" | "info" | "warn" | "error"
    private readonly logger: Logger
    private readonly screenshotOnError: boolean
    private readonly htmlContentOnError: boolean
    readonly defaultTimeout: number

    constructor({
        browser,
        logLevel,
        screenshotOnError,
        htmlContentOnError,
        defaultTimeout: optionsDefaultTimeout,
    }: TikTokOptions) {
        this.browser = browser
        this.logLevel = logLevel
        this.logger = createLogger(TikTok.name, logLevel)
        this.screenshotOnError = screenshotOnError
        this.htmlContentOnError = htmlContentOnError
        this.defaultTimeout = optionsDefaultTimeout ?? defaultTimeout
    }

    static async create(options: CreateTikTokOptions) {
        const puppeteer = new PuppeteerExtra(...requireVanillaPuppeteer())

        puppeteer.use(StealthPlugin())

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: options.puppeteer.executablePath,
            userDataDir: options.puppeteer.userDataDir,
            args: [
                "--start-maximized",
                "--lang=pt-BR",
                "--accept-lang=pt-BR,pt;q=0.9",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",
                ...(options.puppeteer.extraArgs ?? []),
            ],
        })

        return new TikTok({
            browser: browser,
            logLevel: options.logLevel ?? "info",
            screenshotOnError: options.screenshotOnError ?? true,
            htmlContentOnError: options.htmlContentOnError ?? true,
            defaultTimeout: options.defaultTimeout,
        })
    }

    async close() {
        this.logger.info("Closing browser")
        await this.browser.close()
        this.logger.debug("Browser closed")
    }

    private async initalizePage() {
        this.logger.info("Initalizing page")

        const page = await this.browser.newPage()

        await page.setViewport({
            width: 1920,
            height: 919,
        })

        await page.goto(this.baseUrl, { waitUntil: "domcontentloaded" })

        this.logger.debug("Page initalized")

        return page
    }

    private async executeWithDiagnostics(actions: Action<any>[]) {
        const page = await this.initalizePage()

        try {
            let result: any

            for (const action of actions) {
                result = await action({
                    logger: this.logger,
                    page: page,
                    defaultTimeout: this.defaultTimeout,
                })
            }

            return result
        } catch (error) {
            this.logger.error(error)

            const errorsDir = path.join(process.cwd(), "errors")
            const currentErrorDir = path.join(errorsDir, `error-${Date.now()}`)

            if (this.screenshotOnError || this.htmlContentOnError) {
                this.logger.info("Creating error directory")
                await fs.promises.mkdir(currentErrorDir, { recursive: true })
                this.logger.debug("Error directory created")
            }

            if (this.screenshotOnError) {
                this.logger.info("Taking screenshot")
                await page.screenshot({ path: `${currentErrorDir}/error.png` })
                this.logger.debug("Screenshot taken")
            }

            if (this.htmlContentOnError) {
                const htmlContent = await page.content()
                await fs.promises.writeFile(`${currentErrorDir}/error.html`, htmlContent)
            }

            throw error
        } finally {
            await page.close()
        }
    }

    async needsLogin() {
        this.logger.info("Checking if needs login")

        const page = await this.initalizePage()

        const needsLogin = await needsLoginAction({
            logger: this.logger,
            page: page,
            defaultTimeout: this.defaultTimeout,
        })

        await page.close()

        this.logger.debug(`Needs login: ${needsLogin}`)

        return needsLogin
    }

    async login() {
        this.logger.info("Logging in")

        await this.executeWithDiagnostics([loginAction])
    }

    async ensureLoggedIn() {
        this.logger.info("Ensuring logged in")

        const needsLogin = await this.needsLogin()

        if (needsLogin) {
            await this.login()
        }

        this.logger.debug("Logged in")
    }

    async createPost({ filePath, caption, advancedSettings }: CreatePostOptions) {
        this.logger.info("Creating post")

        await this.executeWithDiagnostics([
            goToTiktokStudioAction,
            clickOnLoadButtonAction,
            selectFileAction(filePath),
            putCaptionAction(caption),
            clickOnOpenAdvancedSettingsButtonAction,
            selectAdvancedSettingsAction(advancedSettings),
            clickOnPublishButtonAction,
            tryClickOnConfirmPublishAction,
        ])

        this.logger.debug("Post created")
    }
}
