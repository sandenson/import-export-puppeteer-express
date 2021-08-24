import USERAGENTS, { USERAGENTBROWSER, USERAGENTOS } from "../@types/USERAGENTS";
import VIEWPORTS, { VIEWPORTSENUM } from "..//@types/VIEWPORTS";
import Puppeteer from "../services/Puppeteer";
import { v4 } from "uuid";

export default class Profile {
    private _id: string = '';
    private _name: string = '';
    private _os: USERAGENTOS = 'windows';
    private _browser: USERAGENTBROWSER = 'edge';
    private _language: string = 'english';
    private _viewport: VIEWPORTSENUM = '1024x620';

    constructor(props: Omit<Profile, 'start'>) {
        this._id = props.id ? props.id : v4();
        this._name = props.name;
        this._os = props.os;
        this._browser = props.browser;
        this._language = props.browser;
        this._viewport = props.viewport;
    }

    public async start() {
        const puppeteer = Puppeteer.getPuppeteer();
        
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: `./tmp/${this.id}`,
            args: ['--no-sandbox'],
            defaultViewport: VIEWPORTS[this.viewport],
        });
    
        const page = await browser.newPage();
        
        page.setUserAgent(USERAGENTS[this.os][this.browser]);
        
        await page.goto('https://facebook.com/');

        await browser.close();
    }

    public toJSON() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            os: this.os,
            browser: this.browser,
            language: this.language,
            viewport: this.viewport
        });
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get os() {
        return this._os;
    }

    public set os(os: USERAGENTOS) {
        this._os = os;
    }

    public get browser() {
        return this._browser;
    }

    public set browser(browser: USERAGENTBROWSER) {
        this._browser = browser;
    }

    public get language() {
        return this._language;
    }

    public set language(language: string) {
        this._language = language;
    }

    public get viewport() {
        return this._viewport;
    }

    public set viewport(viewPort: VIEWPORTSENUM) {
        this._viewport = viewPort;
    }
}