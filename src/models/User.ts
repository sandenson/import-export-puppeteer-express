import { VIEW_PORTS } from '../@types/VIEW_PORTS';
import Puppeteer from '../services/puppeteer';
// import { promises as fs } from 'fs';
// import { Cookie, Page } from 'puppeteer-extra/node_modules/@types/puppeteer';

export class User {
  public name: string = '';

  public email: string = '';

  public OS: string = '';

  public browser: string = '';

  public language: string = '';

  public viewport: keyof typeof VIEW_PORTS = 'WEB';

  constructor(props: User) {
    Object.assign(this, props);
  }

  public async start() {
    const puppeteer = Puppeteer.getPuppeteer();

    puppeteer.launch({
      headless: true,
      userDataDir: `./tmp/${this.email}`,
      args: ['--no-sandbox'],
      defaultViewport: VIEW_PORTS[this.viewport],
      executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      slowMo: 10,
    }).then(async browser => {
      const page = await browser.newPage();
      await page.setJavaScriptEnabled(true);
      await page.goto('https://www.facebook.com/');
      
      await browser.close();
    });
  }
}
