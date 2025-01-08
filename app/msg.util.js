"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceString = exports.getMessageCode = void 0;
const app_info_1 = require("./app.info");
function getMessageCode(errcode, params, defaultMessage) {
    if (errcode && errcode.trim().length > 0) {
        let program_message = (0, app_info_1.getProgramMessage)();
        let lang = (0, app_info_1.getDefaultLanguage)();
        if (!lang || lang.trim().length == 0)
            lang = "EN";
        let msg = program_message.find((item) => { return item.code == errcode; });
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
