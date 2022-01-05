import { browser } from "webextension-polyfill-ts";
import { getRobloxUserFromCookies } from "../shared/roblox";

browser.runtime.onMessage.addListener(async (request) => {
    switch (request.type) {
        case "load-cookies":
        {
            document.cookie = request.cookies;   
        }
    }
})

export {};
