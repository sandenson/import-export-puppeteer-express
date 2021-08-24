import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export default class Puppeteer {
    public static getPuppeteer(): typeof puppeteer {
        puppeteer.use(StealthPlugin());
        return puppeteer;
    }
}