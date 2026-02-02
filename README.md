# Puptok

**Puptok** is a powerful automation library for TikTok built on top of `puppeteer`. It simplifies the process of interacting with TikTok programmatically, allowing you to log in and create posts with ease.

## 📦 Installation

Installation is straightforward; just use your preferred package manager. Here is an example using NPM:

```bash
npm i puptok
```

## 🚀 Usage

<a href="https://www.buymeacoffee.com/marcuth">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="200">
</a>

### Basic Example

Here is how to use `Puptok` to log in and create a post.

```ts
import { TikTok } from "puptok"

async function main() {
    // 1. Initialize the TikTok instance
    // Note: Puppeteer launches in non-headless mode (visible UI) by default.
    // This is intentional to avoid bot detection, as headless detection 
    // on TikTok hasn't been fully stress-tested yet.
    const tiktok = await TikTok.create({
        puppeteer: {
            userDataDir: ".user-data", // Persist session
        },
        logLevel: "debug",
        screenshotOnError: true,
    })

    // 2. Ensure you are logged in
    // IMPORTANT: Login is MANUAL.
    // If not logged in, this will open the login page and PAUSE execution
    // until you manually log in using the browser window.
    await tiktok.ensureLoggedIn()

    // 3. Create a post
    // Note: This feature is currently in Beta.
    await tiktok.createPost({
        filePath: "./path/to/video.mp4",
        caption: "Hello from Puptok! 🚀 #automation #tiktok",
    })

    console.log(`Post created!`)
    // NOTE: Retrieving the final URL is not yet implemented.
    // We are looking for contributors to help with this!

    // 4. Close the instance
    await tiktok.close()
}

main()
```

---

### Features

#### 🤖 Automated Interactions

Puptok handles the complex DOM interactions required to navigate TikTok, including handling dialogues, buttons, and inputs.

#### 👁️ Visible Execution (Anti-Detection)

By default, the browser runs in **visible (non-headless) mode**. This is not only to facilitate the manual login process but also to **avoid TikTok's bot detection mechanisms**. As the project is still in development, we haven't yet fully tested or implemented advanced evasion techniques for headless mode. Keeping the browser visible helps ensure your account remains safe and scripts run successfully.

#### 🔐 Login Management (Manual)

Easily manage user sessions. `ensureLoggedIn` checks if a valid session exists. **If login is required, the automation pauses and waits for you to manually log in** (handling Captchas, 2FA, etc.). Once you are in, the session is saved for future runs.

#### 📸 Post Creation

Automate content publishing with support for:
- **Video Upload**: Upload video files directly from your file system.
- **Captions**: Add rich text captions to your posts.
- **Advanced Settings**: Configure advanced post settings (programmatically supported).

#### ⚠️ Known Limitations & Roadmap

- **No Post URL**: Currently, `createPost` **does not return the URL of the published video**. This is still under development.
- **Beta Status**: The project is in active development and testing.

**We highly encourage contributions to help implement URL retrieval and improve stability!**

#### 🐞 Debugging

When things go wrong, Puptok helps you diagnose the issue. If `screenshotOnError` or `htmlContentOnError` are enabled (default: `true`), Puptok creates an `errors` directory in your project root.

Each error generates a timestamped folder containing:
- **error.png**: A screenshot of the page at the time of the error.
- **error.html**: The HTML content of the page.

---

## 🧪 Tests (Not included yet, CONTRIBUTE! :D)

Automated tests are located in `__tests__`. To run them:

```bash
npm run test
```

## 🤝 Contributing

Want to contribute? Especially for **getting the post URL**? Follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-new`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-new`).
5. Open a Pull Request.

## 📝 License

This project is licensed under the MIT License.
