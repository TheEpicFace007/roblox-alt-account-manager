import { browser } from "webextension-polyfill-ts";
import CookieJar from "./cookiejar";
import { getRobloxUserFromCookies } from "./roblox";
import type { Tabs } from 'webextension-polyfill-ts'

export class AltAccount {
  public isFavorite: boolean;
  /**
   * This array contain all the favorites game for the alt account id
   */
  public favoriteGames: string[] = []

  constructor(public id: string, public cookies: CookieJar) {
    this.id = id;
    this.cookies = cookies;
  }
  /**
   * This method will save the account to storage
   */
  public async save(): Promise<void> {
    // save the account to storage using an json object
    const saveData = {
      id: this.id,
      cookies: this.cookies.toString(),
      favoriteGames: this.favoriteGames,
      isFavorite: this.isFavorite 
    }
    await browser.storage.local.set({
      [this.id]: saveData
    })
  }

  /**
   * This method will remove the account from storage
   */
  public async delete(): Promise<void> {
    // delete the account from storage
    await browser.storage.local.remove(this.id)
  }

  /**
   * This static method will pull an alt account from storage.
   * @param id The id of the account to pull.
   * @returns The account.
   */
  public static async get(id: string): Promise<AltAccount> {
    const data = await browser.storage.local.get(id)
    if (!data[id])
      throw new Error("The account does not exist.");
    const account = new AltAccount(id, CookieJar.fromString(data[id].cookies))
    account.favoriteGames = data[id].favoriteGames
    account.isFavorite = data[id].isFavorite
    return account
  }

  /**
   * This static method will pull all the alt accounts from storage.
   * @returns The accounts.
   */
  public static async getAll(): Promise<AltAccount[]> {
    const accounts = await browser.storage.local.get()
    return Object.values(accounts).map(account => {
      const altAccount = new AltAccount(account.id, CookieJar.fromString(account.cookies))
      altAccount.favoriteGames = account.favoriteGames
      altAccount.isFavorite = account.isFavorite
      return altAccount
    })
  }

  /**
   * This method will create a new alt account from the given tab.
   * @param tab The tab to create the account from. If no tab is given, the current tab will be used.
   * @returns The new account.
   * @throws If the tab is not a roblox tab.
   */
  public static async createFromTab(tab?: Tabs.Tab): Promise<AltAccount> {
    if (!tab) {
      let queried = await browser.tabs.query({ currentWindow: true, active: true })
      tab = queried[0]
    }
    
    if (!tab.url?.startsWith("https://roblox.com")) {
      throw new Error("The tab is not a roblox tab.");
    }
    if (!tab.id)
      throw new Error("The tab does not have an id."); 
    const cookies = await CookieJar.fromTab(tab.id)
    const user = await getRobloxUserFromCookies(cookies);
    let account: AltAccount;

    if (user.id)
      account = new AltAccount(user.id, cookies);
    else if (user.Id)
      account = new AltAccount(user.Id, cookies);
    else
      throw new Error("Could not get the user id from the cookies.");
    account.save()
    return account;
  }

  /**
   * This method will load the alt account to the tab.
   * @param tab The tab to load the account to. If no tab is given, the current tab will be used.
   * @returns The tab.
   * @throws If the tab is not a roblox tab.
   */
  public async loadToTab(tab?: Tabs.Tab) {
    if (!tab) {
      let queried = await browser.tabs.query({ currentWindow: true, active: true })
      tab = queried[0]
    }
    if (!tab.url?.startsWith("https://roblox.com")) {
      throw new Error("The tab is not a roblox tab.");
    }
    if (!tab.id)
      throw new Error("The tab does not have an id.");
    this.cookies.loadToTab(tab.id);
  }
}