"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelModel = exports.getLabelObject = exports.getLabelItem = exports.getLabel = void 0;
const app_info_1 = require("./app.info");
function getLabel(name, defaultLabel, lang = (0, app_info_1.getDefaultLanguage)()) {
    let result = undefined;
    let default_labels = (0, app_info_1.getDefaultLabels)();
    let program_labels = (0, app_info_1.getProgramLabels)();
    if (!lang || lang.trim().length == 0)
        lang = "EN";
    let label_item = getLabelItem(name, lang, program_labels);
    if (label_item) {
        result = label_item.value;
    }
    if (!result) {
        label_item = getLabelItem(name, lang, default_labels);
        if (label_item) {
            result = label_item.value;
        }
    }
    return result ? result : defaultLabel;
}
exports.getLabel = getLabel;
function getLabelItem(name, lang, label_category) {
    if (!lang || lang.trim().length == 0)
        lang = "EN";
    let lang_item = label_category.find((item) => { return item.language == lang; });
    if (!lang_item)
        lang_item = label_category.find((item) => { return item.language == "EN"; });
    if (lang_item) {
        return lang_item.label.find((item) => { return item.name == name; });
    }
    return undefined;
}
exports.getLabelItem = getLabelItem;
function getLabelObject(lang = (0, app_info_1.getDefaultLanguage)(), label_category) {
    if (!lang || lang.trim().length == 0)
        lang = "EN";
    let lang_item = label_category.find((item) => { return item.language == lang; });
    if (!lang_item)
        lang_item = label_category.find((item) => { return item.language == "EN"; });
    if (lang_item) {
        return lang_item.label;
    }
    return undefined;
}
exports.getLabelObject = getLabelObject;
function getLabelModel(lang = (0, app_info_1.getDefaultLanguage)()) {
    let default_labels = (0, app_info_1.getDefaultLabels)();
    let program_labels = (0, app_info_1.getProgramLabels)();
    let default_item = getLabelObject(lang, default_labels);
    let program_item = getLabelObject(lang, program_labels);
    let default_model = {};
    let program_model = {};
    if (default_item) {
        default_item.forEach((element) => { default_model[element.name] = element.value; });
    }
    if (program_item) {
        program_item.forEach((element) => { program_model[element.name] = element.value; });
    }
    return Object.assign(default_model, program_model);
}
exports.getLabelModel = getLabelModel;
