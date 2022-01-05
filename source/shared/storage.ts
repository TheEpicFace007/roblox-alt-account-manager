import { browser } from "webextension-polyfill-ts";
import CookieJar from "./cookiejar";
import { getRobloxUserFromCookies } from "./roblox";

/**
 * Save an account to storage. This will write the cookies to the storage with the key `accounts.${account_id}`.
 * @param tabid The tab id of the tab to get the cookies for. If not provided, the current tab will be used.
 * @throws If the tab is not found.
 * @throws IF the tab is not a roblox tab.
 */
async function saveAltAccountFromTab(tabid?: number) {
  const tab = tabid ? await browser.tabs.get(tabid) : (await browser.tabs.query({ active: true, currentWindow: true }))[0];
  if (!tab.id)
    throw new Error("Could not get tab id");
  if (!tab.url)
    throw new Error("Could not get tab url");
  if (!tab.url.startsWith("https://www.roblox.com/") && !tab.url.startsWith("https://web.roblox.com/"))
    throw new Error("Not a Roblox tab");
  
  let cookies: CookieJar = await CookieJar.fromTab(tab.id);
  const account = await getRobloxUserFromCookies(cookies);
  if (account.id) {
    browser.storage.local.set({ [`accounts.${account.id}`]: cookies.toString() });
  }
}

/**
 * Get an account from storage. This will read the cookies from the storage with the key `accounts.${account_id}`.
 * @param account_id The id of the account to get.
 * @returns The cookies for the account.
 * @throws If the account is not found.
*/
async function getAltAccountFromStorage(account_id: number): Promise<CookieJar> {
  const cookies = await browser.storage.local.get(`accounts.${account_id}`);
  if (!cookies[`accounts.${account_id}`])
    throw new Error("Account not found");
  return CookieJar.fromString(cookies[`accounts.${account_id}`]);
}

/**
 * Remove an account from storage. This will remove the cookies from the storage with the key `accounts.${account_id}`.
 * @param account_id The id of the account to remove.
 * @throws If the account is not found.
*/
async function removeAltAccountFromStorage(account_id: number) {
  const cookies = await browser.storage.local.get(`accounts.${account_id}`);
  if (!cookies[`accounts.${account_id}`])
    throw new Error("Account not found");
  browser.storage.local.remove(`accounts.${account_id}`);
}

/**
 * Get all accounts from storage. This will read the cookies from the storage with the key `accounts.${account_id}`.
 * @returns The cookies for all accounts.
 */
async function getAllAltAccountsFromStorage(): Promise<{ [account_id: number]: CookieJar }> {
  const cookies = await browser.storage.local.get();
  const accounts: { [account_id: number]: CookieJar } = {};
  for (const key of Object.keys(cookies)) {
    if (key.startsWith("accounts.")) {
      const account_id = parseInt(key.substring(9));
      accounts[account_id] = CookieJar.fromString(cookies[key]);
    }
  }
  return accounts;
}

export {
  saveAltAccountFromTab,
  getAltAccountFromStorage,
  removeAltAccountFromStorage,
  getAllAltAccountsFromStorage
};