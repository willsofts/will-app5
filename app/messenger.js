"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindingParentMessaging = exports.bindingChildMessaging = exports.getDH = exports.setupDiffie = exports.handleRequestMessage = exports.sendMessageToOpener = exports.sendMessageToParent = exports.requestAccessorInfo = exports.sendMessageToFrame = exports.sendMessageInterface = exports.removeAccessorInfo = exports.saveAccessorInfo = exports.getAccessTokenKey = exports.getAccessorToken = exports.getAccessorInfo = exports.removeStorage = exports.setStorage = exports.getStorage = exports.getCurrentWindow = exports.setCurrentWindow = exports.setMessagingCallback = exports.getSecureEngine = void 0;
const app_info_1 = require("./app.info");
const app_util_1 = require("./app.util");
const dh_1 = require("./dh");
const secure_ls_1 = __importDefault(require("secure-ls"));
let messagingCallback;
let currentWindow;
let secureEngine;
function getSecureEngine() {
    if (!secureEngine) {
        secureEngine = (0, app_info_1.isSecureStorage)() ? new secure_ls_1.default({ storage: "local" == (0, app_info_1.getBaseStorage)() ? localStorage : sessionStorage }) : null;
    }
    return secureEngine;
}
exports.getSecureEngine = getSecureEngine;
function setMessagingCallback(callback) {
    messagingCallback = callback;
}
exports.setMessagingCallback = setMessagingCallback;
function setCurrentWindow(curwin) {
    currentWindow = curwin;
}
exports.setCurrentWindow = setCurrentWindow;
function getCurrentWindow() { return currentWindow; }
exports.getCurrentWindow = getCurrentWindow;
function getStorage(key) {
    let secureLs = getSecureEngine();
    if (secureLs)
        return secureLs.get(key);
    if ("local" == (0, app_info_1.getBaseStorage)()) {
        return localStorage.getItem(key);
    }
    return sessionStorage.getItem(key);
}
exports.getStorage = getStorage;
function setStorage(key, value) {
    let secureLs = getSecureEngine();
    if (secureLs) {
        secureLs.set(key, value);
        return;
    }
    if ("local" == (0, app_info_1.getBaseStorage)()) {
        localStorage.setItem(key, value);
        return;
    }
    sessionStorage.setItem(key, value);
}
exports.setStorage = setStorage;
function removeStorage(key) {
    let secureLs = getSecureEngine();
    if (secureLs) {
        secureLs.remove(key);
        return;
    }
    if ("local" == (0, app_info_1.getBaseStorage)()) {
        localStorage.removeItem(key);
        return;
    }
    sessionStorage.removeItem(key);
}
exports.removeStorage = removeStorage;
function getAccessorInfo() {
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
exports.getAccessorInfo = getAccessorInfo;
function getAccessorToken() {
    let json = getAccessorInfo();
    if (json?.authtoken) {
        return json.authtoken;
    }
    let token = (0, app_info_1.getApiToken)();
    return token || "";
}
exports.getAccessorToken = getAccessorToken;
function getAccessTokenKey() {
    let json = getAccessorInfo();
    if (json?.tokenkey) {
        return json.tokenkey;
    }
    let token = (0, app_info_1.getTokenKey)();
    return token || "";
}
exports.getAccessTokenKey = getAccessTokenKey;
function saveAccessorInfo(json) {
    setStorage("accessorinfo", JSON.stringify(json));
}
exports.saveAccessorInfo = saveAccessorInfo;
function removeAccessorInfo() {
    removeStorage("accessorinfo");
}
exports.removeAccessorInfo = removeAccessorInfo;
function sendMessageInterface(type, win) {
    let moderator = win ? "opener" : "parent";
    let info = getAccessorInfo();
    let options = getStorage("accessoptions");
    let msg = { type: type || "storage", archetype: "willsofts", moderator: moderator, API_URL: (0, app_info_1.getApiUrl)(), BASE_URL: (0, app_info_1.getBaseUrl)(), CDN_URL: (0, app_info_1.getCdnUrl)(), IMG_URL: (0, app_info_1.getImgUrl)(), DEFAULT_LANGUAGE: (0, app_info_1.getDefaultLanguage)(), API_TOKEN: (0, app_info_1.getApiToken)(), BASE_STORAGE: (0, app_info_1.getBaseStorage)(), SECURE_STORAGE: (0, app_info_1.isSecureStorage)(), BASE_CSS: (0, app_info_1.getBaseCss)(), CHAT_URL: (0, app_info_1.getChatUrl)(), MULTI_LANGUAGES: (0, app_info_1.getMultiLanguages)(), TOKEN_KEY: (0, app_info_1.getTokenKey)(), META_INFO: (0, app_info_1.getMetaInfo)(), accessorinfo: info, accessoptions: options };
    return sendMessageToFrame(msg, win);
}
exports.sendMessageInterface = sendMessageInterface;
const ALLOWED_ORIGINS = "*";
function sendMessageToFrame(data, win) {
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
exports.sendMessageToFrame = sendMessageToFrame;
function requestAccessorInfo(callback) {
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
exports.requestAccessorInfo = requestAccessorInfo;
function sendMessageToParent(data) {
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
exports.sendMessageToParent = sendMessageToParent;
function sendMessageToOpener(data) {
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
exports.sendMessageToOpener = sendMessageToOpener;
function handleRequestMessage(data) {
    if (data.type == "storage") {
        console.log("handleRequestMessage: data", data);
        const setters = {
            TOKEN_KEY: app_info_1.setTokenKey,
            API_URL: app_info_1.setApiUrl,
            BASE_URL: app_info_1.setBaseUrl,
            CDN_URL: app_info_1.setCdnUrl,
            IMG_URL: app_info_1.setImgUrl,
            DEFAULT_LANGUAGE: app_info_1.setDefaultLanguage,
            API_TOKEN: app_info_1.setApiToken,
            BASE_STORAGE: app_info_1.setBaseStorage,
            SECURE_STORAGE: app_info_1.setSecureStorage,
            BASE_CSS: app_info_1.setBaseCss,
            CHAT_URL: app_info_1.setChatUrl,
            MULTI_LANGUAGES: app_info_1.setMultiLanguages,
            DEFAULT_RAW_PARAMETERS: app_info_1.setDefaultRawParameters,
            META_INFO: app_info_1.setMetaInfo
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
        console.info("handleRequestMessage: DEFAULT_LANGUAGE=" + (0, app_info_1.getDefaultLanguage)(), ", BASE_STORAGE=" + (0, app_info_1.getBaseStorage)(), ", DEFAULT_RAW_PARAMETERS=" + (0, app_info_1.getDefaultRawParameters)(), ", SECURE_STORAGE=" + (0, app_info_1.isSecureStorage)());
        console.info("handleRequestMessage: API_URL=" + (0, app_info_1.getApiUrl)(), ", BASE_URL=" + (0, app_info_1.getBaseUrl)(), ", CDN_URL=" + (0, app_info_1.getCdnUrl)(), ", IMG_URL=" + (0, app_info_1.getImgUrl)() + ", BASE_CSS=" + (0, app_info_1.getBaseCss)() + ", CHAT_URL=" + (0, app_info_1.getChatUrl)() + ", MULTI_LANGUAGES=" + (0, app_info_1.getMultiLanguages)());
        console.info("handleRequestMessage: API_TOKEN=" + (0, app_info_1.getApiToken)(), ", META_INFO=", (0, app_info_1.getMetaInfo)());
        (0, app_util_1.createLinkStyle)((0, app_info_1.getBaseCss)());
    }
    handleMessagingCallback(data);
}
exports.handleRequestMessage = handleRequestMessage;
function handleMessagingCallback(data) {
    if (!messagingCallback || data.archetype !== "willsofts") {
        return;
    }
    if (data.type === "storage") {
        try {
            (0, app_info_1.initConfigure)();
        }
        catch (ex) {
            console.error(ex);
        }
    }
    const exceptTypes = (0, app_info_1.getMetaInfo)().EXCEPT_MESSAGE_TYPES ?? ["appinfo"];
    if (exceptTypes.includes(data.type)) {
        return;
    }
    messagingCallback(data);
}
function setupDiffie(json) {
    console.log("setupDiffie", getAccessorToken());
    let info = json.body.info;
    if (info) {
        const dh = new dh_1.DH();
        dh.prime = info.prime;
        dh.generator = info.generator;
        dh.otherPublicKey = info.publickey;
        dh.compute();
        if (String((0, app_info_1.getMetaInfo)().DISABLE_DIFFIE) !== "true") {
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
exports.setupDiffie = setupDiffie;
function getDH() {
    let json = getAccessorInfo();
    if (json?.info) {
        let info = json.info;
        if (!info.handshake || info.handshake == "" || info.handshake == "F")
            return null; //not confirm or fail
        if (info.prime && info.generator && info.publickey && info.privatekey && info.sharedkey && info.otherpublickey) {
            const dh = new dh_1.DH();
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
exports.getDH = getDH;
function bindingChildMessaging() {
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
exports.bindingChildMessaging = bindingChildMessaging;
function bindingParentMessaging(callback) {
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
exports.bindingParentMessaging = bindingParentMessaging;
