import { browser } from "webextension-polyfill-ts";
import CookieJar from "./cookiejar";
import { getRobloxUserFromCookies } from "./roblox";
import type { Tabs } from 'webextension-polyfill-ts';

export class AltAccount {
  public username: string;

  constructor(public id: string, public cookies: CookieJar) {
    this.id = id;
    this.cookies = cookies;
  }

  public async save() {
    const accounts = await browser.storage.local.get("accounts");
    if (!accounts.accounts) {
      accounts.accounts = {};
    }
    accounts.accounts[this.id] = this;
    await browser.storage.local.set(accounts);
  }

  public static async getAll(): Promise<AltAccount[]> {
    const accounts = await browser.storage.local.get("accounts");
    if (!accounts.accounts) {
      return [];
    }
    return Object.values(accounts.accounts);
  }

  public static async getWithUsername(username: string) {
    const accounts = await AltAccount.getAll();
    for (const account of accounts) {
      if (account.username === username) {
        return account;
      }
    }
    return null;
  }
  
  public static async get(id: string) {
    const accounts = await browser.storage.local.get("accounts");
    if (!accounts.accounts) {
      return null;
    }
    // crate an alt account object from the data
    return new AltAccount(accounts.accounts[id].id, accounts.accounts[id].cookies);
  }

  public static async remove(id: string) {
    const accounts = await browser.storage.local.get("accounts");
    if (!accounts.accounts) {
      return;
    }
    delete accounts.accounts[id];
    await browser.storage.local.set(accounts);
  }

  public static async use(id: string) {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      throw new Error("No active tab");
    }
    const account = await AltAccount.get(id);
    if (!account)
      throw new Error("Account not found");
    await browser.cookies.set({
      url: "https://www.roblox.com",
      name: ".ROBLOSECURITY",
      value: account.cookies._cookies.find(([c]) => c === ".ROBLOSECURITY")![1],
      domain: ".roblox.com",
      path: "/",
      storeId: tab.cookieStoreId,
    });
    await browser.tabs.reload(tab.id);
  }
}