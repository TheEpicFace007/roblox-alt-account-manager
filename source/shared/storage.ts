import { Storage } from "webextension-polyfill-ts"
import CookieJar from "./cookiejar";
import { getRobloxUserById, getRobloxUserFromCookies, getRobloxUserHeadshot, isAccountValid } from "./roblox";
import { } from "lodash"

export interface iAltAccount {
  cookieStr: string;
  username: string;
  thumb: string;
  // Roblox user id of alt
  id: string;
  // Tracker to know when the code has updated one of the fields above
  lastUpdated: number;
}

class AccountDoesNotExistError extends Error {
  constructor() {
    super("Account does not exist or invalid cookies");
  }
}

export async function  createAltAccount(cookie: CookieJar): Promise<[iAltAccount | null, AccountDoesNotExistError | null]> {
  // remove the useless cookie
  const uselessCookie = [
    /gig_bootstrap(\w|_)+/,
    /gig_canary/,
    /GuestData/,
    /RBXcb/,
    /RBXEventTrackerV2/,
    /RBXSource/
  ]

  for (const cookieName of uselessCookie)
    cookie.removeFromRegex(cookieName)
  

  
  if (!isAccountValid(cookie))
    return [null, new AccountDoesNotExistError()];

  const { id, username } = await getRobloxUserFromCookies(cookie)
  if (!id || !username)
    return [null, new AccountDoesNotExistError()];
  const thumb = await getRobloxUserHeadshot({ usernameOrId: id, res: 512 })

  const alt: iAltAccount = {
    id,
    cookieStr: cookie.toString(),
    username, thumb,
    lastUpdated: Date.now()
  };
  // Store alt account to the extension storage
  const extStorage = new Storage()
  if (!extStorage.getItem("alts"))
    extStorage.setItem("alts", JSON.stringify([alt]))
  else
    extStorage.setItem("alts", JSON.stringify([...JSON.parse(extStorage.getItem("alts") as string), alt])) 
  
  return [alt, null]
}

export function getAllAccount(): iAltAccount[] {
  const extStorage = new Storage()
  let alts = extStorage.getItem("alts")
  alts ??= "[]"
  return JSON.parse(alts)
}

/**
 * Update the alts thumbnail to the alts that has been updated since last lastUpdatedOffset 
 */
export async function updateAlts(lastUpdatedOffset: number) {
  const extStorage = new Storage()
  const alts = JSON.parse(extStorage.getItem("alts") ?? "[]") as iAltAccount[]
  const altToUpdate = alts.filter(alt => alt.lastUpdated > lastUpdatedOffset)
  
  for (const alt of altToUpdate) {
    const { id, username } = alt
    alt.thumb = await getRobloxUserHeadshot({ usernameOrId: id, res: 512 })
    alt.lastUpdated = Date.now()
    alts[alts.findIndex(alt => alt.id === id)] = alt// Replace the alt in the storage
  }
  
  // Update the storage with the new alts
  extStorage.setItem("alts", JSON.stringify(alts))
}

/**
 * This interface contain an alts favorite game. 
 * It is used to store the favorite game of the alts.
 */
export interface iAltFavoriteGame {
  // This is a string because roblox uses 64 bit id
  gameId: string;
  name: string;
  thumb: string;
}

export type iAltFavoriteGameList = iAltFavoriteGame[]

export function setAltFavoriteGame(altId: string, game: iAltFavoriteGame) {
  const extStorage = new Storage()
  const alts = JSON.parse(extStorage.getItem("alts") ?? "[]") as iAltAccount[]
  const alt = alts.find(alt => alt.id === altId)
  if (!alt)
    throw new Error("Alt account does not exist")
  
  const storage = new Storage()
  
  const storage_key = `altFavoriteGame_${altId}`;
  if (!storage.getItem(storage_key))
    storage.setItem(storage_key, JSON.stringify([game]))
  else
    storage.setItem(storage_key, JSON.stringify([...JSON.parse(storage.getItem(storage_key) as string), game]))
}


export function getAltFavoriteGame(altId: string): iAltFavoriteGameList {
  const extStorage = new Storage()
  const alts = JSON.parse(extStorage.getItem("alts") ?? "[]") as iAltAccount[]
  const alt = alts.find(alt => alt.id === altId)
  if (!alt)
    throw new Error("Alt account does not exist")
  
  const storage = new Storage()
  const storage_key = `altFavoriteGame_${altId}`;
  let games = storage.getItem(storage_key)
  games ??= "[]"
  return JSON.parse(games)
}

export function removeAltFavoriteGame(altId: string, gameId: string) {
  const extStorage = new Storage()
  const alts = JSON.parse(extStorage.getItem("alts") ?? "[]") as iAltAccount[]
  const alt = alts.find(alt => alt.id === altId)
  if (!alt)
    throw new Error("Alt account does not exist")
  
  const storage = new Storage()
  const storage_key = `altFavoriteGame_${altId}`;
  let games = storage.getItem(storage_key)
  games ??= "[]"
  let gamesList: iAltFavoriteGameList = JSON.parse(games)
  gamesList = gamesList.filter(game => game.gameId !== gameId)
  storage.setItem(storage_key, JSON.stringify(games))
}