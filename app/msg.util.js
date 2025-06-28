"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMessageCode = exports.loadAndMergeMessageCode = exports.getApiMessageCode = exports.mergeMessageCodes = exports.replaceString = exports.getMessageCode = void 0;
const jquery_1 = __importDefault(require("jquery"));
const app_info_1 = require("./app.info");
const messenger_1 = require("./messenger");
function getMessageCode(errcode, params, defaultMessage) {
    if (errcode && errcode.trim().length > 0) {
        let program_message = (0, app_info_1.getProgramMessage)();
        let lang = (0, app_info_1.getDefaultLanguage)();
        if (!lang || lang.trim().length == 0)
            lang = "EN";
        let msg = null;
        //try find out from storage cached first
        let message_code = (0, messenger_1.getStorage)("message_code");
        if (message_code) {
            msg = message_code.find((item) => { return item.code == errcode; });
        }
        if (!msg)
            msg = program_message.find((item) => { return item.code == errcode; });
        if (msg) {
            let text = msg[lang];
            if (text && text.trim().length > 0) {
                return replaceString(text, params);
            }
        }
    }
    return defaultMessage ? defaultMessage : errcode;
}
exports.getMessageCode = getMessageCode;
function replaceString(str, arrStr) {
    if (arrStr) {
        let regex = /%s/;
        for (let i = 0; i < arrStr.length; i++) {
            let t_str = arrStr[i];
            str = str.replace(regex, t_str);
        }
    }
    if (str) {
        let regex = /%s/g;
        str = str.replace(regex, "");
    }
    return str;
}
exports.replaceString = replaceString;
function mergeMessageCodes(data_messages) {
    if (!data_messages)
        return false;
    if (!Array.isArray(data_messages) || data_messages.length <= 0)
        return false;
    let program_message = (0, app_info_1.getProgramMessage)();
    program_message.unshift(...data_messages);
    return true;
}
exports.mergeMessageCodes = mergeMessageCodes;
function getApiMessageCode() {
    return (0, app_info_1.getApiUrl)() + ((0, app_info_1.getMetaInfo)()?.API_MESSAGE_CODE || "/api/msgcode/fetch");
}
exports.getApiMessageCode = getApiMessageCode;
function loadAndMergeMessageCode(callback, loadMessageCode = String((0, app_info_1.getMetaInfo)()?.LOAD_MESSAGE_CODE) == "true", url = getApiMessageCode()) {
    if (!loadMessageCode)
        return;
    //if exist in storage then do not make request
    if ((0, messenger_1.getStorage)("message_code")) {
        return;
    }
    fetchMessageCode(undefined, function (success, data) {
        if (success) {
            (0, messenger_1.setStorage)("message_code", data.body);
            if (callback)
                callback(success, data.body);
        }
    }, url);
}
exports.loadAndMergeMessageCode = loadAndMergeMessageCode;
function fetchMessageCode(code, callback, url = getApiMessageCode()) {
    console.log("fetchMessageCode: ", code);
    let authtoken = (0, messenger_1.getAccessorToken)();
    jquery_1.default.ajax({
        url: url,
        type: "POST",
        data: code ? JSON.stringify({ msgcode: code }) : "",
        dataType: "json",
        headers: { "authtoken": authtoken },
        contentType: app_info_1.DEFAULT_CONTENT_TYPE,
        error: function (transport, status, errorThrown) {
            console.error(errorThrown);
            if (callback)
                callback(false, errorThrown, transport);
        },
        success: function (data) {
            if (callback)
                callback(true, data);
        }
    });
}
exports.fetchMessageCode = fetchMessageCode;
