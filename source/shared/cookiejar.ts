/**
 * Reimplementation of the cookie jar python module. This is a simple implementation
 */
export default class CookieJar {
  private _cookies: [string, string][];
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

  static fromString(cookieString: string): CookieJar {
    const jar = new CookieJar();
    const cookies = cookieString.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      jar.set(name, value);
    }
    return jar;
  }
}