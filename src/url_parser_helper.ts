import puppeteer, { Browser } from "puppeteer";

class UrlParserHelper {
  private static instance: UrlParserHelper;

  private constructor() {}

  static getInstance(): UrlParserHelper {
    if (!UrlParserHelper.instance) {
      UrlParserHelper.instance = new UrlParserHelper();
    }
    return UrlParserHelper.instance;
  }

  async parse(url: string) {
    const browser = await puppeteer.launch();

    try {
      if (url.includes("youtube.com/") || url.includes("youtu.be/")) {
        return await this.parseYoutube(url, browser);
      } else if (url.includes("twitter.com/") || url.includes("x.com/")) {
        return await this.parseX(url, browser);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error: ", error);
      return null;
    } finally {
      await browser.close();
    }
  }

  toString(
    parsedUrl: XContentResponse | YoutubeContentResponse | null
  ): string | null {
    if (parsedUrl === null) {
      return null;
    } else if ("title" in parsedUrl) {
      return (
        "TITLE: " +
        parsedUrl.title +
        "\n DESCRIPTION: " +
        parsedUrl.videoDescription
      ).substring(0, 500);
    } else if ("tweetBody" in parsedUrl) {
      return ("TWEET: " + parsedUrl.tweetBody).substring(0, 500);
    } else return null;
  }

  private async parseYoutube(
    url: string,
    browser: Browser
  ): Promise<YoutubeContentResponse> {
    // Launch the browser and open a new blank page
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto(url, { waitUntil: "load" });

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector("#expand");

    const handle = await page.$("#expand");
    if (handle !== null) {
      await delay(500);

      // Wait and click on first result.
      await page.click("#expand");

      await delay(500);
    }

    //get first h1 element
    const title = await page.$eval(
      ".ytd-watch-metadata h1",
      (el) => el.textContent
    );

    //get video description
    const videoDescription = await page.$eval(
      ".yt-core-attributed-string--link-inherit-color",
      (el) => el.textContent
    );

    return { title, videoDescription } as YoutubeContentResponse;
  }

  private async parseX(url: string, browser: Browser) {
    // Launch the browser and open a new blank page
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto(url, { waitUntil: "load" });

    await page.setViewport({ width: 1080, height: 1024 });

    const element = await page.waitForSelector('[data-testid="tweetText"]', {
      timeout: 5000,
    });

    if (element === null) {
      return null;
    }

    const tweetBody = await element.evaluate((el) => el.textContent);
    //return XContentResponse
    return { tweetBody } as XContentResponse;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const urlParserHelper = UrlParserHelper.getInstance();

export default urlParserHelper;

interface YoutubeContentResponse {
  title: string;
  videoDescription: string;
}

interface XContentResponse {
  tweetBody: string;
}

export { YoutubeContentResponse, XContentResponse };
