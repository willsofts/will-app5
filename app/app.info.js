"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAppConfig = exports.initConfigure = exports.loadAppConfig = exports.assignAppConfig = exports.getMultiLanguagesModel = exports.appInit = exports.setProgramLabels = exports.setDefaultLabels = exports.setProgramMessage = exports.getProgramLabels = exports.getDefaultLabels = exports.getProgramMessage = exports.setMetaInfo = exports.getMetaInfo = exports.setTokenKey = exports.getTokenKey = exports.setBaseCss = exports.getBaseCss = exports.isSecureStorage = exports.setSecureStorage = exports.setDefaultRawParameters = exports.setBaseStorage = exports.setChatUrl = exports.setImgUrl = exports.setCdnUrl = exports.setBaseUrl = exports.setApiUrl = exports.setApiToken = exports.getDefaultRawParameters = exports.getBaseStorage = exports.getChatUrl = exports.getImgUrl = exports.getCdnUrl = exports.getBaseUrl = exports.getApiUrl = exports.getApiToken = exports.setDefaultLanguage = exports.getDefaultLanguage = exports.setMultiLanguages = exports.getMultiLanguages = exports.registerNotification = exports.getAppInfo = exports.DEFAULT_CONTENT_TYPE = void 0;
const messenger_1 = require("./messenger");
const app_util_1 = require("./app.util");
const appInfo = {
    DEFAULT_LANGUAGE: process.env.VUE_APP_DEFAULT_LANGUAGE,
    API_URL: process.env.VUE_APP_API_URL,
    BASE_URL: process.env.VUE_APP_BASE_URL,
    CDN_URL: process.env.VUE_APP_CDN_URL,
    IMG_URL: process.env.VUE_APP_IMG_URL,
    CHAT_URL: process.env.VUE_APP_CHAT_URL,
    BASE_STORAGE: process.env.VUE_APP_BASE_STORAGE,
    API_TOKEN: process.env.VUE_APP_API_TOKEN,
    DEFAULT_RAW_PARAMETERS: process.env.VUE_APP_DEFAULT_RAW_PARAMETERS == "true",
    SECURE_STORAGE: process.env.VUE_APP_SECURE_STORAGE == "true",
    BASE_CSS: process.env.VUE_APP_BASE_CSS,
    MULTI_LANGUAGES: ["EN", "TH"],
    TOKEN_KEY: process.env.VUE_APP_TOKEN_KEY,
    META_INFO: {},
};
var APP_MULTI_LANGUAGES = process.env.VUE_APP_MULTI_LANGUAGES;
if (APP_MULTI_LANGUAGES && APP_MULTI_LANGUAGES.trim().length > 0) {
    let multilangs = JSON.parse(APP_MULTI_LANGUAGES);
    if (Array.isArray(multilangs))
        appInfo.MULTI_LANGUAGES = multilangs;
}
exports.DEFAULT_CONTENT_TYPE = "application/json; charset=UTF-8";
console.log("AppInfo", appInfo);
var notifyCallback;
function getAppInfo() { return appInfo; }
exports.getAppInfo = getAppInfo;
function registerNotification(callback) { notifyCallback = callback; }
exports.registerNotification = registerNotification;
function getMultiLanguages() { return appInfo.MULTI_LANGUAGES; }
exports.getMultiLanguages = getMultiLanguages;
function setMultiLanguages(values) {
    console.info("set MULTI_LANGUAGES", values);
    if (values)
        appInfo.MULTI_LANGUAGES = values;
    if (notifyCallback)
        notifyCallback("multi-languages", appInfo.MULTI_LANGUAGES);
}
exports.setMultiLanguages = setMultiLanguages;
function getDefaultLanguage() { return appInfo.DEFAULT_LANGUAGE; }
exports.getDefaultLanguage = getDefaultLanguage;
function setDefaultLanguage(language) {
    console.log("set default_language=" + language);
    if (language && language.trim().length > 0)
        appInfo.DEFAULT_LANGUAGE = language;
}
exports.setDefaultLanguage = setDefaultLanguage;
function getApiToken() { return appInfo.API_TOKEN; }
exports.getApiToken = getApiToken;
function getApiUrl() { return appInfo.API_URL; }
exports.getApiUrl = getApiUrl;
function getBaseUrl() { return appInfo.BASE_URL; }
exports.getBaseUrl = getBaseUrl;
function getCdnUrl() { return appInfo.CDN_URL; }
exports.getCdnUrl = getCdnUrl;
function getImgUrl() { return appInfo.IMG_URL; }
exports.getImgUrl = getImgUrl;
function getChatUrl() { return appInfo.CHAT_URL; }
exports.getChatUrl = getChatUrl;
function getBaseStorage() { return appInfo.BASE_STORAGE; }
exports.getBaseStorage = getBaseStorage;
function getDefaultRawParameters() { return appInfo.DEFAULT_RAW_PARAMETERS; }
exports.getDefaultRawParameters = getDefaultRawParameters;
function setApiToken(value) { appInfo.API_TOKEN = value; }
exports.setApiToken = setApiToken;
function setApiUrl(value) { appInfo.API_URL = value; }
exports.setApiUrl = setApiUrl;
function setBaseUrl(value) { appInfo.BASE_URL = value; }
exports.setBaseUrl = setBaseUrl;
function setCdnUrl(value) { appInfo.CDN_URL = value; }
exports.setCdnUrl = setCdnUrl;
function setImgUrl(value) { appInfo.IMG_URL = value; }
exports.setImgUrl = setImgUrl;
function setChatUrl(value) { appInfo.CHAT_URL = value; }
exports.setChatUrl = setChatUrl;
function setBaseStorage(value) { appInfo.BASE_STORAGE = value; }
exports.setBaseStorage = setBaseStorage;
function setDefaultRawParameters(value) { appInfo.DEFAULT_RAW_PARAMETERS = value; }
exports.setDefaultRawParameters = setDefaultRawParameters;
function setSecureStorage(value) { appInfo.SECURE_STORAGE = value; }
exports.setSecureStorage = setSecureStorage;
function isSecureStorage() { return appInfo.SECURE_STORAGE; }
exports.isSecureStorage = isSecureStorage;
function getBaseCss() { return appInfo.BASE_CSS; }
exports.getBaseCss = getBaseCss;
function setBaseCss(value) { appInfo.BASE_CSS = value; }
exports.setBaseCss = setBaseCss;
function getTokenKey() { return appInfo.TOKEN_KEY; }
exports.getTokenKey = getTokenKey;
function setTokenKey(value) { appInfo.TOKEN_KEY = value; }
exports.setTokenKey = setTokenKey;
function getMetaInfo() { return appInfo.META_INFO; }
exports.getMetaInfo = getMetaInfo;
function setMetaInfo(value = {}) { appInfo.META_INFO = value; }
exports.setMetaInfo = setMetaInfo;
var default_labels = [];
var program_labels = [];
var program_message = [];
function getProgramMessage() { return program_message; }
exports.getProgramMessage = getProgramMessage;
function getDefaultLabels() { return default_labels; }
exports.getDefaultLabels = getDefaultLabels;
function getProgramLabels() { return program_labels; }
exports.getProgramLabels = getProgramLabels;
function setProgramMessage(message) { program_message = message; }
exports.setProgramMessage = setProgramMessage;
function setDefaultLabels(labels) { default_labels = labels; }
exports.setDefaultLabels = setDefaultLabels;
function setProgramLabels(labels) { program_labels = labels; }
exports.setProgramLabels = setProgramLabels;
function appInit(settings = { program_message, default_labels, program_labels, listen_messaging: 'child' }) {
    const setting = Object.assign({ listen_messaging: 'child' }, settings);
    setProgramMessage(setting.program_message);
    setDefaultLabels(setting.default_labels);
    setProgramLabels(setting.program_labels);
    if (setting.listen_messaging == 'child') {
        (0, messenger_1.bindingChildMessaging)();
    }
    else if (setting.listen_messaging == 'parent') {
        (0, messenger_1.bindingParentMessaging)();
    }
    initConfigure();
}
exports.appInit = appInit;
function getMultiLanguagesModel(datas) {
    let multilangs = datas || getMultiLanguages();
    if (!multilangs)
        multilangs = ["EN", "TH"];
    return multilangs.map((item) => { return { lang: item, label: item + "_lang" }; });
}
exports.getMultiLanguagesModel = getMultiLanguagesModel;
function assignAppConfig(data, callback) {
    console.log("assignAppConfig:", data);
    if (!data)
        return;
    if (data.TOKEN_KEY !== undefined)
        setTokenKey(data.TOKEN_KEY);
    if (data.API_URL !== undefined)
        setApiUrl(data.API_URL);
    if (data.BASE_URL !== undefined)
        setBaseUrl(data.BASE_URL);
    if (data.CDN_URL !== undefined)
        setCdnUrl(data.CDN_URL);
    if (data.IMG_URL !== undefined)
        setImgUrl(data.IMG_URL);
    if (data.DEFAULT_LANGUAGE !== undefined)
        setDefaultLanguage(data.DEFAULT_LANGUAGE);
    if (data.API_TOKEN !== undefined)
        setApiToken(data.API_TOKEN);
    if (data.BASE_STORAGE !== undefined)
        setBaseStorage(data.BASE_STORAGE);
    if (data.SECURE_STORAGE !== undefined)
        setSecureStorage(data.SECURE_STORAGE);
    if (data.BASE_CSS !== undefined)
        setBaseCss(data.BASE_CSS);
    if (data.CHAT_URL !== undefined)
        setChatUrl(data.CHAT_URL);
    if (data.MULTI_LANGUAGES !== undefined)
        setMultiLanguages(data.MULTI_LANGUAGES);
    if (data.DEFAULT_RAW_PARAMETERS !== undefined)
        setDefaultRawParameters(data.DEFAULT_RAW_PARAMETERS);
    if (data.META_INFO !== undefined)
        setMetaInfo(data.META_INFO);
    console.info("appConfig: DEFAULT_LANGUAGE=" + getDefaultLanguage(), ", BASE_STORAGE=" + getBaseStorage(), ", DEFAULT_RAW_PARAMETERS=" + getDefaultRawParameters(), ", SECURE_STORAGE=" + isSecureStorage());
    console.info("appConfig: API_URL=" + getApiUrl(), ", BASE_URL=" + getBaseUrl(), ", CDN_URL=" + getCdnUrl(), ", IMG_URL=" + getImgUrl() + ", BASE_CSS=" + getBaseCss() + ", CHAT_URL=" + getChatUrl() + ", MULTI_LANGUAGES=" + getMultiLanguages());
    console.info("appConfig: API_TOKEN=" + getApiToken(), ", META_INFO=", getMetaInfo());
    (0, app_util_1.createLinkStyle)(getBaseCss());
    if (callback)
        callback(data);
}
exports.assignAppConfig = assignAppConfig;
function loadAppConfig(callback, url = "../config/app.config.json") {
    initConfigure();
    fetch(url).then(response => response.json()).then(data => {
        assignAppConfig(data, callback);
    }).catch(() => { if (callback)
        callback(); });
}
exports.loadAppConfig = loadAppConfig;
function initConfigure() {
    let key = "TOKEN_KEY";
    let token = localStorage.getItem(key);
    if (!token || token.trim().length == 0)
        token = sessionStorage.getItem(key);
    if (token)
        setTokenKey(token);
    const searchParams = new URLSearchParams(window.location.href);
    token = searchParams.get("fsKey");
    if (!token || token.trim().length == 0)
        token = searchParams.get("tokenkey");
    if (token)
        setTokenKey(token);
}
exports.initConfigure = initConfigure;
function initAppConfig(callback) {
    try {
        assignAppConfig(window.getAppConfigs(), callback);
    }
    catch (ex) {
        console.error(ex);
    }
}
exports.initAppConfig = initAppConfig;
