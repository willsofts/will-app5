"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLabel = exports.loadAndMergeLabel = exports.mergeProgramLabels = exports.getApiLabel = exports.getLabelModel = exports.getLabelObject = exports.getLabelItem = exports.getLabel = void 0;
const jquery_1 = __importDefault(require("jquery"));
const app_info_1 = require("./app.info");
const messenger_1 = require("./messenger");
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
function getApiLabel() {
    return (0, app_info_1.getApiUrl)() + ((0, app_info_1.getMetaInfo)().API_LABEL || "/api/label/fetch");
}
exports.getApiLabel = getApiLabel;
function mergeProgramLabels(data_labels) {
    if (!data_labels)
        return false;
    if (!Array.isArray(data_labels) || data_labels.length <= 0)
        return false;
    let program_labels = (0, app_info_1.getProgramLabels)();
    for (let data of data_labels) {
        let lang = data.language;
        let lang_item = program_labels.find((item) => { return item.language == lang; });
        if (lang_item) {
            let concat_labels = [...lang_item.label, ...data.label];
            lang_item.label = [...new Map(concat_labels.map(item => [item.name, item])).values()];
        }
    }
    return true;
}
exports.mergeProgramLabels = mergeProgramLabels;
function loadAndMergeLabel(id, callback, loadLabel = String((0, app_info_1.getMetaInfo)()?.LOAD_LABEL) == "true", url = getApiLabel()) {
    if (!loadLabel)
        return;
    fetchLabel(id, function (success, data) {
        if (success) {
            let merged = mergeProgramLabels(data.body);
            if (merged && callback)
                callback(true, data);
        }
    }, url);
}
exports.loadAndMergeLabel = loadAndMergeLabel;
function fetchLabel(id, callback, url = getApiLabel()) {
    console.log("fetchLabel:", id);
    let authtoken = (0, messenger_1.getAccessorToken)();
    jquery_1.default.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify({ labelid: id }),
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
exports.fetchLabel = fetchLabel;
