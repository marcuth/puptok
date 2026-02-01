export class TikTokError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "TikTokError"
    }
}
