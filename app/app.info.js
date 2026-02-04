import { bindingChildMessaging, bindingParentMessaging } from "./messenger";
import { createLinkStyle } from "./app.util";
const env = (typeof import.meta !== "undefined" && import.meta.env) ??
    (typeof process !== "undefined" ? process.env : {});
const appInfo = {
    DEFAULT_LANGUAGE: env.VUE_APP_DEFAULT_LANGUAGE,
    API_URL: env.VUE_APP_API_URL,
    BASE_URL: env.VUE_APP_BASE_URL,
    CDN_URL: env.VUE_APP_CDN_URL,
    IMG_URL: env.VUE_APP_IMG_URL,
    CHAT_URL: env.VUE_APP_CHAT_URL,
    BASE_STORAGE: env.VUE_APP_BASE_STORAGE,
    API_TOKEN: env.VUE_APP_API_TOKEN,
    DEFAULT_RAW_PARAMETERS: env.VUE_APP_DEFAULT_RAW_PARAMETERS == "true",
    SECURE_STORAGE: env.VUE_APP_SECURE_STORAGE == "true",
    BASE_CSS: env.VUE_APP_BASE_CSS,
    MULTI_LANGUAGES: ["EN", "TH"],
    TOKEN_KEY: env.VUE_APP_TOKEN_KEY,
    META_INFO: {},
};
let APP_MULTI_LANGUAGES = env.VUE_APP_MULTI_LANGUAGES;
if (APP_MULTI_LANGUAGES && APP_MULTI_LANGUAGES.trim().length > 0) {
    let multilangs = JSON.parse(APP_MULTI_LANGUAGES);
    if (Array.isArray(multilangs))
        appInfo.MULTI_LANGUAGES = multilangs;
}
export const DEFAULT_CONTENT_TYPE = "application/json; charset=UTF-8";
console.log("AppInfo", appInfo);
let notifyCallback;
export function getConfig(key) { return appInfo[key]; }
export function getAppInfo() { return appInfo; }
export function registerNotification(callback) { notifyCallback = callback; }
export function getMultiLanguages() { return appInfo.MULTI_LANGUAGES; }
export function setMultiLanguages(values) {
    console.info("set MULTI_LANGUAGES", values);
    if (values)
        appInfo.MULTI_LANGUAGES = values;
    if (notifyCallback)
        notifyCallback("multi-languages", appInfo.MULTI_LANGUAGES);
}
export function getDefaultLanguage() { return appInfo.DEFAULT_LANGUAGE; }
export function setDefaultLanguage(language) {
    console.log("set default_language=" + language);
    if (language && language.trim().length > 0)
        appInfo.DEFAULT_LANGUAGE = language;
}
export function getApiToken() { return appInfo.API_TOKEN; }
export function getApiUrl() { return appInfo.API_URL; }
export function getBaseUrl() { return appInfo.BASE_URL; }
export function getCdnUrl() { return appInfo.CDN_URL; }
export function getImgUrl() { return appInfo.IMG_URL; }
export function getChatUrl() { return appInfo.CHAT_URL; }
export function getBaseStorage() { return appInfo.BASE_STORAGE; }
export function getDefaultRawParameters() { return appInfo.DEFAULT_RAW_PARAMETERS; }
export function setApiToken(value) { appInfo.API_TOKEN = value; }
export function setApiUrl(value) { appInfo.API_URL = value; }
export function setBaseUrl(value) { appInfo.BASE_URL = value; }
export function setCdnUrl(value) { appInfo.CDN_URL = value; }
export function setImgUrl(value) { appInfo.IMG_URL = value; }
export function setChatUrl(value) { appInfo.CHAT_URL = value; }
export function setBaseStorage(value) { appInfo.BASE_STORAGE = value; }
export function setDefaultRawParameters(value) { appInfo.DEFAULT_RAW_PARAMETERS = value; }
export function setSecureStorage(value) { appInfo.SECURE_STORAGE = value; }
export function isSecureStorage() { return appInfo.SECURE_STORAGE; }
export function getBaseCss() { return appInfo.BASE_CSS; }
export function setBaseCss(value) { appInfo.BASE_CSS = value; }
export function getTokenKey() { return appInfo.TOKEN_KEY; }
export function setTokenKey(value) { appInfo.TOKEN_KEY = value; }
export function getMetaInfo() { return appInfo.META_INFO; }
export function setMetaInfo(value = {}) { appInfo.META_INFO = value; }
let default_labels = [];
let program_labels = [];
let program_message = [];
export function getProgramMessage() { return program_message; }
export function getDefaultLabels() { return default_labels; }
export function getProgramLabels() { return program_labels; }
export function setProgramMessage(message) { program_message = message; }
export function setDefaultLabels(labels) { default_labels = labels; }
export function setProgramLabels(labels) { program_labels = labels; }
export function appInit(options, callback) {
    const settings = options ?? { program_message, default_labels, program_labels, listen_messaging: 'child' };
    const setting = { listen_messaging: 'child', ...settings };
    setProgramMessage(setting.program_message);
    setDefaultLabels(setting.default_labels);
    setProgramLabels(setting.program_labels);
    if (setting.listen_messaging == 'child') {
        bindingChildMessaging();
    }
    else if (setting.listen_messaging == 'parent') {
        bindingParentMessaging(callback);
    }
    initConfigure();
}
export function getMultiLanguagesModel(datas) {
    let multilangs = datas || getMultiLanguages();
    if (!multilangs)
        multilangs = ["EN", "TH"];
    return multilangs.map((item) => { return { lang: item, label: item + "_lang" }; });
}
export function assignAppConfig(data, callback) {
    console.log("assignAppConfig:", data);
    if (!data)
        return;
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
    console.info("appConfig: DEFAULT_LANGUAGE=" + getDefaultLanguage(), ", BASE_STORAGE=" + getBaseStorage(), ", DEFAULT_RAW_PARAMETERS=" + getDefaultRawParameters(), ", SECURE_STORAGE=" + isSecureStorage());
    console.info("appConfig: API_URL=" + getApiUrl(), ", BASE_URL=" + getBaseUrl(), ", CDN_URL=" + getCdnUrl(), ", IMG_URL=" + getImgUrl() + ", BASE_CSS=" + getBaseCss() + ", CHAT_URL=" + getChatUrl() + ", MULTI_LANGUAGES=" + getMultiLanguages());
    console.info("appConfig: API_TOKEN=" + getApiToken(), ", META_INFO=", getMetaInfo());
    createLinkStyle(getBaseCss());
    if (callback)
        callback(data);
}
export function loadAppConfig(callback, url = "../config/app.config.json") {
    initConfigure();
    fetch(url).then(response => response.json()).then(data => {
        assignAppConfig(data, callback);
    }).catch(() => { if (callback)
        callback(); });
}
export function initConfigure() {
    let key = "TOKEN_KEY";
    let token = localStorage.getItem(key);
    if (!token || token.trim().length == 0)
        token = sessionStorage.getItem(key);
    if (token)
        setTokenKey(token);
    const searchParams = new URLSearchParams(globalThis.location.href);
    token = searchParams.get("fsKey");
    if (!token || token.trim().length == 0)
        token = searchParams.get("tokenkey");
    if (token)
        setTokenKey(token);
}
export function initAppConfig(callback) {
    try {
        assignAppConfig(globalThis.getAppConfigs(), callback);
    }
    catch (ex) {
        console.error(ex);
    }
}
