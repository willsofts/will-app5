import { getApiUrl, getBaseUrl, getCdnUrl, getImgUrl, getDefaultLanguage, getApiToken, getBaseStorage, setApiUrl, setBaseUrl, setCdnUrl, setImgUrl, setDefaultLanguage, setApiToken, getDefaultRawParameters, setDefaultRawParameters, setBaseStorage, isSecureStorage, setSecureStorage, getBaseCss, setBaseCss, getChatUrl, setChatUrl, getMultiLanguages, setMultiLanguages, initConfigure, getTokenKey, setTokenKey, getMetaInfo, setMetaInfo } from "./app.info";
import { createLinkStyle } from "./app.util";
import { DH } from "./dh";
import SecureLS from 'secure-ls';
let messagingCallback;
let currentWindow;
let secureEngine;
export function getSecureEngine() {
    if (!secureEngine) {
        secureEngine = isSecureStorage() ? new SecureLS({ storage: "local" == getBaseStorage() ? localStorage : sessionStorage }) : null;
    }
    return secureEngine;
}
export function setMessagingCallback(callback) {
    messagingCallback = callback;
}
export function setCurrentWindow(curwin) {
    currentWindow = curwin;
}
export function getCurrentWindow() { return currentWindow; }
export function getStorage(key) {
    let secureLs = getSecureEngine();
    if (secureLs)
        return secureLs.get(key);
    if ("local" == getBaseStorage()) {
        return localStorage.getItem(key);
    }
    return sessionStorage.getItem(key);
}
export function setStorage(key, value) {
    let secureLs = getSecureEngine();
    if (secureLs) {
        secureLs.set(key, value);
        return;
    }
    if ("local" == getBaseStorage()) {
        localStorage.setItem(key, value);
        return;
    }
    sessionStorage.setItem(key, value);
}
export function removeStorage(key) {
    let secureLs = getSecureEngine();
    if (secureLs) {
        secureLs.remove(key);
        return;
    }
    if ("local" == getBaseStorage()) {
        localStorage.removeItem(key);
        return;
    }
    sessionStorage.removeItem(key);
}
export function getAccessorInfo() {
    let info = getStorage("accessorinfo");
    if (info && info != "") {
        try {
            return JSON.parse(info);
        }
        catch (ex) {
            console.error(ex);
        }
    }
    return null;
}
export function getAccessorToken() {
    let json = getAccessorInfo();
    if (json?.authtoken) {
        return json.authtoken;
    }
    let token = getApiToken();
    return token || "";
}
export function getAccessTokenKey() {
    let json = getAccessorInfo();
    if (json?.tokenkey) {
        return json.tokenkey;
    }
    let token = getTokenKey();
    return token || "";
}
export function saveAccessorInfo(json) {
    setStorage("accessorinfo", JSON.stringify(json));
}
export function removeAccessorInfo() {
    removeStorage("accessorinfo");
}
export function sendMessageInterface(type, win) {
    let moderator = win ? "opener" : "parent";
    let info = getAccessorInfo();
    let options = getStorage("accessoptions");
    let msg = { type: type || "storage", archetype: "willsofts", moderator: moderator, API_URL: getApiUrl(), BASE_URL: getBaseUrl(), CDN_URL: getCdnUrl(), IMG_URL: getImgUrl(), DEFAULT_LANGUAGE: getDefaultLanguage(), API_TOKEN: getApiToken(), BASE_STORAGE: getBaseStorage(), SECURE_STORAGE: isSecureStorage(), BASE_CSS: getBaseCss(), CHAT_URL: getChatUrl(), MULTI_LANGUAGES: getMultiLanguages(), TOKEN_KEY: getTokenKey(), META_INFO: getMetaInfo(), accessorinfo: info, accessoptions: options };
    return sendMessageToFrame(msg, win);
}
const ALLOWED_ORIGINS = "*";
export function sendMessageToFrame(data, win) {
    if (!data)
        return false;
    try {
        console.log("sendMessageToFrame:", data);
        data.archetype = "willsofts";
        if (win) {
            win.postMessage(JSON.stringify(data), ALLOWED_ORIGINS); // NOSONAR - intentional broadcast, validated on receiver
        }
        else {
            let frames = document.getElementsByTagName('iframe');
            if (frames) {
                for (let fr of frames) {
                    let awin = fr.contentWindow;
                    if (awin)
                        awin.postMessage(JSON.stringify(data), ALLOWED_ORIGINS); // NOSONAR - intentional broadcast, validated on receiver	
                }
            }
        }
        return true;
    }
    catch (ex) {
        console.log(ex);
    }
    return false;
}
export function requestAccessorInfo(callback) {
    if (callback)
        setMessagingCallback(callback);
    let msg = { type: "accessorinfo", archetype: "willsofts" };
    console.log("requestAccessorInfo: ", msg);
    console.log("window.opener", window.opener);
    console.log("window.parent", window.parent);
    if (window.opener) {
        return sendMessageToOpener(msg);
    }
    return sendMessageToParent(msg);
}
export function sendMessageToParent(data) {
    if (!data)
        return;
    try {
        console.log("sendMessageToParent:", data);
        window.parent.postMessage(JSON.stringify(data), ALLOWED_ORIGINS); // NOSONAR - intentional broadcast, validated on receiver
        return true;
    }
    catch (ex) {
        console.log(ex);
    }
    return false;
}
export function sendMessageToOpener(data) {
    if (!data)
        return;
    try {
        console.log("sendMessageToOpener:", data);
        window.opener.postMessage(JSON.stringify(data), ALLOWED_ORIGINS); // NOSONAR - intentional broadcast, validated on receiver
        return true;
    }
    catch (ex) {
        console.log(ex);
    }
    return false;
}
export function handleRequestMessage(data) {
    if (data.type == "storage") {
        console.log("handleRequestMessage: data", data);
        const setters = {
            TOKEN_KEY: setTokenKey,
            API_URL: setApiUrl,
            BASE_URL: setBaseUrl,
            CDN_URL: setCdnUrl,
            IMG_URL: setImgUrl,
            DEFAULT_LANGUAGE: setDefaultLanguage,
            API_TOKEN: setApiToken,
            BASE_STORAGE: setBaseStorage,
            SECURE_STORAGE: setSecureStorage,
            BASE_CSS: setBaseCss,
            CHAT_URL: setChatUrl,
            MULTI_LANGUAGES: setMultiLanguages,
            DEFAULT_RAW_PARAMETERS: setDefaultRawParameters,
            META_INFO: setMetaInfo
        };
        for (const key in setters) {
            if (data[key] !== undefined) {
                setters[key](data[key]);
            }
        }
        if (data.accessoptions !== undefined)
            setStorage("accessoptions", data.accessoptions);
        if (data.accessorinfo) {
            saveAccessorInfo(data.accessorinfo);
        }
        console.info("handleRequestMessage: accessor info", data.accessorinfo);
        console.info("handleRequestMessage: DEFAULT_LANGUAGE=" + getDefaultLanguage(), ", BASE_STORAGE=" + getBaseStorage(), ", DEFAULT_RAW_PARAMETERS=" + getDefaultRawParameters(), ", SECURE_STORAGE=" + isSecureStorage());
        console.info("handleRequestMessage: API_URL=" + getApiUrl(), ", BASE_URL=" + getBaseUrl(), ", CDN_URL=" + getCdnUrl(), ", IMG_URL=" + getImgUrl() + ", BASE_CSS=" + getBaseCss() + ", CHAT_URL=" + getChatUrl() + ", MULTI_LANGUAGES=" + getMultiLanguages());
        console.info("handleRequestMessage: API_TOKEN=" + getApiToken(), ", META_INFO=", getMetaInfo());
        createLinkStyle(getBaseCss());
    }
    handleMessagingCallback(data);
}
function handleMessagingCallback(data) {
    if (!messagingCallback || data.archetype !== "willsofts") {
        return;
    }
    if (data.type === "storage") {
        try {
            initConfigure();
        }
        catch (ex) {
            console.error(ex);
        }
    }
    const exceptTypes = getMetaInfo().EXCEPT_MESSAGE_TYPES ?? ["appinfo"];
    if (exceptTypes.includes(data.type)) {
        return;
    }
    messagingCallback(data);
}
export function setupDiffie(json) {
    console.log("setupDiffie", getAccessorToken());
    let info = json.body.info;
    if (info) {
        const dh = new DH();
        dh.prime = info.prime;
        dh.generator = info.generator;
        dh.otherPublicKey = info.publickey;
        dh.compute();
        if (String(getMetaInfo().DISABLE_DIFFIE) !== "true") {
            dh.updatePublicKey((success) => {
                if (success) {
                    info.handshake = "C"; //confirm
                    saveAccessorInfo(json.body);
                }
            });
        }
        info.privatekey = dh.privateKey;
        info.publickey = dh.publicKey;
        info.sharedkey = dh.sharedKey;
        info.otherpublickey = dh.otherPublicKey;
        info.handshake = "";
        saveAccessorInfo(json.body);
    }
}
export function getDH() {
    let json = getAccessorInfo();
    if (json?.info) {
        let info = json.info;
        if (!info.handshake || info.handshake == "" || info.handshake == "F")
            return null; //not confirm or fail
        if (info.prime && info.generator && info.publickey && info.privatekey && info.sharedkey && info.otherpublickey) {
            const dh = new DH();
            dh.prime = info.prime;
            dh.generator = info.generator;
            dh.otherPublicKey = info.publickey;
            dh.privateKey = info.privatekey;
            dh.publicKey = info.publickey;
            dh.sharedKey = info.sharedkey;
            dh.otherPublicKey = info.otherpublickey;
            return dh;
        }
    }
    return null;
}
export function bindingChildMessaging() {
    window.onmessage = function (e) {
        console.log("window-messenger: onmessage:", e.data);
        try {
            let payload = e.data;
            if (typeof payload === 'string') {
                payload = JSON.parse(e.data);
            }
            //in case of parent window, try to send accessor info
            /* try it as below
            if(payload.type=="accessorinfo") {
                sendMessageInterface("storage",getCurrentWindow());
                return;
            }*/
            //in case of child window, try to handle request message
            handleRequestMessage(payload);
        }
        catch (ex) {
            console.error(ex);
        }
    };
}
export function bindingParentMessaging(callback) {
    window.onmessage = function (e) {
        console.log("window-main: onmessage:", e.data);
        try {
            let payload = e.data;
            if (typeof payload === 'string') {
                payload = JSON.parse(e.data);
            }
            //in case of parent window, try to send accessor info            
            if (payload.type == "accessorinfo") {
                sendMessageInterface("storage", getCurrentWindow());
                return;
            }
            else if (payload.type == "appinfo") {
                sendMessageInterface("appinfo", getCurrentWindow());
                return;
            }
            //in case of child window, try to handle request message
            //try it: handleRequestMessage(payload);
            if (callback)
                callback(payload);
        }
        catch (ex) {
            console.error(ex);
        }
    };
}
