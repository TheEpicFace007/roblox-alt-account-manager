import { Storage } from "webextension-polyfill-ts"

export type AltType = "main" | "alt" | "fav";
export type AltID = `alt-${AltType}-${string}`

export interface iAltAccount {
  roblo_security_token?: string;
  id?: AltID
}

/**
 * Create an alt account. 
 * This will generate an random id based off of 
 */
export async function createAltAccount(account: iAltAccount) {

  return account
}