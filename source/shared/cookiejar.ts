import { browser } from "webextension-polyfill-ts";
import type { Tabs } from "webextension-polyfill-ts";

/**
 * Reimplementation of the cookie jar python module. This is a simple implementation
 */
export default class CookieJar {
  public _cookies: [string, string][];
  constructor() {
    this._cookies = [];
  }
  public add(cookie: string, value?: string): void {
    if (value) {
      this._cookies.push([cookie, value]);
    } else {
      this._cookies.push([cookie, ""]);
    }
  }
  public get(cookie: string): string | undefined {
    const index = this._cookies.findIndex(([c]) => c === cookie);
    if (index !== -1) {
      return this._cookies[index][1];
    }
    return undefined;
  }
  public remove(cookie: string): void {
    const index = this._cookies.findIndex(([c]) => c === cookie);
    if (index !== -1) {
      this._cookies.splice(index, 1);
    }
  }
  public clear(): void {
    this._cookies = [];
  }

  public set(cookie: string, value: string): void {
    const index = this._cookies.findIndex(([c]) => c === cookie);
    if (index !== -1) {
      this._cookies[index][1] = value;
    } else {
      this._cookies.push([cookie, value]);
    }
  }

  public getAll(): [string, string][] {
    return this._cookies;
  }

  public toString(): string {
    return this._cookies.map(([c, v]) => `${c}=${v}`).join("; ");
  }

  public removeFromRegex(regex: RegExp): void {
    this._cookies = this._cookies.filter(([c]) => !regex.test(c));
  }

  static fromString(cookieString: string): CookieJar {
    const jar = new CookieJar();
    const cookies = cookieString.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      jar.set(name, value);
    }
    return jar;
  }

  static async fromTab(tabid: number): Promise<CookieJar> {
    try {
      const tab = await browser.tabs.get(tabid)
      if (tab.url) {
        const cookies = await browser.cookies.getAll({ url: tab.url });
        const jar = new CookieJar();
        for (const cookie of cookies) {
          jar.set(cookie.name, cookie.value);
        }
        return jar;
      } else {
        throw new Error("Tab does not have a url");
      }
    } catch (e) {
      throw new Error("Could not get cookies from tab");
    }
  }

  public loadToTab(tabid: number): void {
    browser.tabs.sendMessage(tabid, {
      type: "load-cookies",
      cookies: this.toString()
    });
  }
}