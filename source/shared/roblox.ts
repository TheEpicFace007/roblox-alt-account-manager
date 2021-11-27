import CookieJar from "./cookiejar";

export interface RobloxUser {
  id?: number;
  username?: string;
}

export async function getRobloxUser(username: string): Promise<RobloxUser> {
  const response = await fetch(`https://api.roblox.com/users/get-by-username?username=${username}`);
  const json = await response.json();
  return json;
}

export async function getRobloxUserById(id: number): Promise<RobloxUser> {
  const response = await fetch(`https://api.roblox.com/users/${id}`);
  const json = await response.json();
  return json;
}

export async function getRobloxUserHeadshot({ usernameOrId, res }: {usernameOrId: string, res: number}): Promise<string> {
  const user = await getRobloxUser(usernameOrId);
  const response = await fetch(`https://www.roblox.com/headshot-thumbnail/json?userId=${user.id}&width=${res}&height=${res}&format=png`);
  const json = await response.json();
  return json.Url;
}



export async function getRobloxUserFromCookies(cookies: CookieJar): Promise<RobloxUser> {
  const response = await fetch("https://users.roblox.com/v1/users/authenticated", {
    headers: {
      "Cookie": cookies.toString(),
    }
  });

  return response.json();
}

export async function isAccountValid(cookie: CookieJar) {
  const { status } = await fetch("https://users.roblox.com/v1/users/authentificated", { headers: { "Cookie": cookie.toString() } });
  if (status === 200)
    return true;
  else
    return false;
}