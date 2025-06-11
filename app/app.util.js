"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestID = exports.generateUUID = exports.disableControls = exports.createLinkStyle = exports.decryptCipherData = exports.serializeParameters = exports.setupApplication = exports.startApplication = exports.confirmRevise = exports.confirmResend = exports.confirmExport = exports.confirmImport = exports.confirmRequest = exports.confirmReject = exports.confirmApprove = exports.confirmErase = exports.confirmReset = exports.confirmReceive = exports.confirmSaveAs = exports.confirmProcess = exports.confirmClear = exports.confirmUpdate = exports.confirmSend = exports.confirmRemove = exports.confirmCancel = exports.confirmSave = exports.confirmDelete = exports.confirmDialogBox = exports.confirmmsg = exports.alertmsg = exports.confirmDialog = exports.confirmbox = exports.alertDialog = exports.alertbox = exports.warningbox = exports.successbox = exports.detectErrorResponse = exports.parseErrorThrown = exports.submitFailure = exports.stopWaiting = exports.startWaiting = exports.openNewWindow = exports.submitWindow = exports.addWindow = exports.closeChildWindows = exports.getWindowByName = void 0;
const jquery_1 = __importDefault(require("jquery"));
const bootbox_1 = __importDefault(require("../bootbox/bootbox"));
const bootstrap_1 = require("bootstrap");
const msg_util_1 = require("./msg.util");
const messenger_1 = require("./messenger");
const app_info_1 = require("./app.info");
const fs_winary = new Array();
function getWindowByName(winname) {
    if (!winname)
        return null;
    for (let i = 0, isz = fs_winary.length; i < isz; i++) {
        try {
            if (fs_winary[i]) {
                if (fs_winary[i].name == winname)
                    return fs_winary[i];
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
    return null;
}
exports.getWindowByName = getWindowByName;
function closeChildWindows() {
    for (let i = 0, isz = fs_winary.length; i < isz; i++) {
        try {
            if (fs_winary[i])
                fs_winary[i].close();
        }
        catch (ex) {
            console.error(ex);
        }
    }
}
exports.closeChildWindows = closeChildWindows;
function addWindow(awindow) {
    if (!awindow)
        return;
    fs_winary.push(awindow);
}
exports.addWindow = addWindow;
function submitWindow(settings) {
    let p = settings;
    if ((p.url && p.url != "") && p.params) {
        let method = p.method || "POST";
        let frm = (0, jquery_1.default)("<form method='" + method + "'></form>");
        frm.attr("action", p.url);
        frm.attr("target", p.windowName);
        if (typeof (p.params) === "string") {
            let prms = p.params.split("&");
            for (let i = 0; i < prms.length; i++) {
                let kary = prms[i].split("=");
                let inp = (0, jquery_1.default)('<input type="hidden" name="' + kary[0] + '"></input>');
                inp.val(kary[1]);
                frm.append(inp);
            }
        }
        else {
            if (Array.isArray(p.params)) {
                for (let i = 0; i < p.params.length; i++) {
                    let prm = p.params[i];
                    if (prm.name) {
                        let inp = (0, jquery_1.default)('<input type="hidden" name="' + prm.name + '"></input>');
                        inp.val(prm.value);
                        frm.append(inp);
                    }
                }
            }
            else {
                if (p.params) {
                    for (let prm in p.params) {
                        let inp = (0, jquery_1.default)('<input type="hidden" name="' + prm + '"></input>');
                        inp.val(p.params[prm]);
                        frm.append(inp);
                    }
                }
            }
        }
        let layer = (0, jquery_1.default)("<div class='open-new-window-submit-layer'></div>");
        layer.append(frm);
        (0, jquery_1.default)("body").append(layer);
        frm.trigger("submit");
        setTimeout(function () { layer.remove(); }, 1500);
    }
}
exports.submitWindow = submitWindow;
function openNewWindow(settings) {
    let defaultSettings = {
        newTab: true,
        method: "POST",
        url: "",
        windowName: "_blank",
        windowWidth: window.screen.availWidth,
        windowHeight: window.screen.availHeight,
        windowFeatures: "toobar=no,menubar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes",
        fullScreen: null,
        params: null
    };
    let p = Object.assign({}, defaultSettings, settings);
    try {
        let fswin = getWindowByName(p.winName);
        if (fswin) {
            fswin.focus();
            return;
        }
    }
    catch (ex) {
        console.error(ex);
    }
    let fs_window = null;
    if (p.newTab) {
        if (p.params)
            fs_window = window.open("", p.windowName);
        else
            fs_window = window.open(p.url, p.windowName);
    }
    else {
        let sw = window.screen.availWidth;
        let sh = window.screen.availHeight;
        let wx = (sw - p.windowWidth) / 2;
        let wy = (sh - p.windowHeight) / 2;
        let fs_features = "top=" + wy + ",left=" + wx + ",width=" + p.windowWidth + ",height=" + p.windowHeight + "," + p.windowFeatures;
        if (p.params)
            fs_window = window.open("", p.windowName, fs_features);
        else
            fs_window = window.open(p.url, p.windowName, fs_features);
    }
    if (fs_window)
        fs_window.opener = self;
    try {
        addWindow(fs_window);
    }
    catch (ex) {
        console.error(ex);
    }
    submitWindow(p);
    return fs_window;
}
exports.openNewWindow = openNewWindow;
function startWaiting() {
    try {
        let dc = (0, jquery_1.default)(document.body);
        let sh = dc.innerHeight();
        let fslayer = (0, jquery_1.default)("#fswaitlayer");
        let lh = fslayer.height();
        let fstop = mouseY;
        if (lh !== undefined && sh !== undefined) {
            if (lh > (sh - fstop))
                fstop = mouseY - lh;
        }
        let dw = dc.innerWidth();
        fslayer.css("top", fstop);
        if (dw !== undefined)
            fslayer.css("left", mouseX > 0 ? mouseX : dw - 50);
        fslayer.show();
    }
    catch (ex) {
        console.error(ex);
    }
}
exports.startWaiting = startWaiting;
function stopWaiting() {
    (0, jquery_1.default)("#fswaitlayer").hide();
}
exports.stopWaiting = stopWaiting;
function submitFailure(xhr, status, errorThrown, checking = true) {
    stopWaiting();
    console.log("submitFailure", xhr.responseText);
    errorThrown = parseErrorThrown(xhr, status, errorThrown);
    alertbox(errorThrown, function () {
        if (checking && xhr.status == 401) {
            try {
                window.parent.reLogin();
            }
            catch (ex) {
                console.error(ex);
            }
        }
    });
}
exports.submitFailure = submitFailure;
function parseErrorThrown(xhr, status, errorThrown) {
    if (!errorThrown) {
        errorThrown = xhr.responseText;
    }
    else {
        if (errorThrown == xhr.status) {
            errorThrown = xhr.responseText;
        }
    }
    try {
        if (xhr.status == 400 || xhr.status == 401)
            errorThrown = xhr.responseText; //400=Bad Request,401=Unauthen
        if (xhr.responseText) {
            let json = JSON.parse(xhr.responseText);
            if (json.message)
                errorThrown = json.message; //support java api
            if (json.text)
                errorThrown = json.text; //support original template
            if (json.head.errordesc)
                errorThrown = json.head.errordesc; //support api
        }
    }
    catch (ex) {
        console.error(ex);
    }
    if (!errorThrown || errorThrown.trim().length == 0)
        errorThrown = "Unknown error or network error";
    return errorThrown;
}
exports.parseErrorThrown = parseErrorThrown;
function detectErrorResponse(data) {
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        }
        catch (ex) {
            console.error(ex);
        }
    }
    if (data?.head?.errorflag == "Y") {
        alertmsg(data.head.errordesc);
        return true;
    }
    return false;
}
exports.detectErrorResponse = detectErrorResponse;
function successbox(callback, params) {
    let title = (0, msg_util_1.getMessageCode)("fsinfo", undefined, "Information");
    alertbox("QS0004", callback, undefined, params, undefined, title, "fa fa-info-circle");
}
exports.successbox = successbox;
function warningbox(errcode, callback, params) {
    let title = (0, msg_util_1.getMessageCode)("fswarn", undefined, "Warning");
    alertbox(errcode, callback, undefined, params, undefined, title, "fa fa-exclamation-circle");
}
exports.warningbox = warningbox;
function alertbox(errcode, callback, defaultmsg, params, addonmsg, title, icon) {
    if (!title || title.trim().length == 0)
        title = (0, msg_util_1.getMessageCode)("fsalert", undefined, "Alert");
    let txt = (0, msg_util_1.getMessageCode)(errcode, params);
    if (txt != null && txt != "") {
        if (addonmsg)
            txt += " " + addonmsg;
        alertDialog(txt, callback, title, icon);
    }
    else {
        if (defaultmsg) {
            if (addonmsg)
                defaultmsg += " " + addonmsg;
            alertDialog(defaultmsg, callback, title, icon);
        }
        else {
            alertDialog(errcode, callback, title, icon);
        }
    }
}
exports.alertbox = alertbox;
function alertDialog(msg, callbackfn, title = "Alert", icon = "fa fa-bell-o") {
    if (!msg) {
        console.log("alertDialog: msg undefined");
        return;
    }
    try {
        let fs_okbtn = (0, msg_util_1.getMessageCode)("fsokbtn");
        if (!fs_okbtn || (fs_okbtn == "" || fs_okbtn == "fsokbtn"))
            fs_okbtn = "OK";
        bootbox_1.default.alert({
            title: "<em class='" + icon + "'></em>&nbsp;<label>" + title + "</label>",
            message: msg,
            callback: function () {
                if (callbackfn)
                    callbackfn();
            },
            buttons: {
                ok: { label: fs_okbtn }
            }
        });
        let dialog = (0, jquery_1.default)(".bootbox > .modal-dialog");
        dialog.draggable();
        return;
    }
    catch (ex) {
        console.error(ex);
    }
    if (callbackfn)
        callbackfn();
}
exports.alertDialog = alertDialog;
function confirmbox(errcode, okFn, cancelFn, defaultmsg, params, addonmsg, title, icon) {
    if (!title || title.trim().length == 0)
        title = (0, msg_util_1.getMessageCode)("fsconfirm", undefined, "Confirmation");
    let txt = (0, msg_util_1.getMessageCode)(errcode, params);
    if (txt != null && txt != "") {
        if (addonmsg)
            txt += " " + addonmsg;
        return confirmDialog(txt, okFn, cancelFn, title, icon);
    }
    else {
        if (defaultmsg) {
            if (addonmsg)
                defaultmsg += " " + addonmsg;
            return confirmDialog(defaultmsg, okFn, cancelFn, title, icon);
        }
        else {
            return confirmDialog(errcode, okFn, cancelFn, title, icon);
        }
    }
}
exports.confirmbox = confirmbox;
function confirmDialog(msg, okCallback, cancelCallback, title = "Confirmation", icon = "fa fa-question-circle") {
    try {
        let fs_confirmbtn = (0, msg_util_1.getMessageCode)("fsconfirmbtn");
        if (!fs_confirmbtn || (fs_confirmbtn == "" || fs_confirmbtn == "fsconfirmbtn"))
            fs_confirmbtn = "OK";
        let fs_cancelbtn = (0, msg_util_1.getMessageCode)("fscancelbtn");
        if (!fs_cancelbtn || (fs_cancelbtn == "" || fs_cancelbtn == "fscancelbtn"))
            fs_cancelbtn = "Cancel";
        bootbox_1.default.confirm({
            title: "<em class='" + icon + "'></em>&nbsp;<label>" + title + "</label>",
            message: msg,
            callback: function (result) {
                if (result) {
                    if (okCallback)
                        okCallback();
                }
                else {
                    if (cancelCallback)
                        cancelCallback();
                }
            },
            swapButtonOrder: true,
            buttons: {
                confirm: { label: fs_confirmbtn },
                cancel: { label: fs_cancelbtn },
            }
        });
        let dialog = (0, jquery_1.default)(".bootbox > .modal-dialog");
        dialog.draggable();
        return true;
    }
    catch (ex) {
        console.error(ex);
    }
    return true;
}
exports.confirmDialog = confirmDialog;
function alertmsg(errcode, defaultmsg, params, callback) {
    alertbox(errcode, callback, defaultmsg, params);
}
exports.alertmsg = alertmsg;
function confirmmsg(errcode, defaultmsg, params, okFn, cancelFn) {
    confirmbox(errcode, okFn, cancelFn, defaultmsg, params);
}
exports.confirmmsg = confirmmsg;
function confirmDialogBox(errcode, params, defaultmsg, okFn, cancelFn, addonmsg) {
    return confirmbox(errcode, okFn, cancelFn, defaultmsg, params, addonmsg);
}
exports.confirmDialogBox = confirmDialogBox;
function confirmDelete(params, okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0001", params, "Do you want to delete this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmDelete = confirmDelete;
function confirmSave(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0002", null, "Do you want to save this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmSave = confirmSave;
function confirmCancel(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0003", null, "Do you want to cancel this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmCancel = confirmCancel;
function confirmRemove(params, okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0005", params, "Do you want to delete this record?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmRemove = confirmRemove;
function confirmSend(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0006", null, "Do you want to send this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmSend = confirmSend;
function confirmUpdate(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0007", null, "Do you want to update this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmUpdate = confirmUpdate;
function confirmClear(params, okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0008", params, "Do you want to clear this?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmClear = confirmClear;
function confirmProcess(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0009", null, "Do you want to process this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmProcess = confirmProcess;
function confirmSaveAs(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0010", null, "Do you want to save as this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmSaveAs = confirmSaveAs;
function confirmReceive(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0011", null, "Do you want to receive this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmReceive = confirmReceive;
function confirmReset(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0012", null, "Do you want to reset this trasaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmReset = confirmReset;
function confirmErase(params, okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0013", params, "Do you want to delete %s row(s)?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmErase = confirmErase;
function confirmApprove(params, okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0014", params, "Do you want to confirm approve the %s request?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmApprove = confirmApprove;
function confirmReject(params, okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0015", params, "Do you want to reject %s?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmReject = confirmReject;
function confirmRequest(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0016", null, "Do you want to create this request?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmRequest = confirmRequest;
function confirmImport(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0017", null, "Do you want to import this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmImport = confirmImport;
function confirmExport(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0018", null, "Do you want to export this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmExport = confirmExport;
function confirmResend(okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0019", null, "Do you want to resend this transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmResend = confirmResend;
function confirmRevise(params, okFn, cancelFn, addonmsg) {
    if (!confirmDialogBox("QS0020", params, "Do you want to revise the transaction?", okFn, cancelFn, addonmsg))
        return false;
    return true;
}
exports.confirmRevise = confirmRevise;
var mouseX = 0;
var mouseY = 0;
function startApplication(pid, callback) {
    console.log("startApplication: pid=" + pid);
    (0, jquery_1.default)(document).on("mousedown", function (e) { mouseX = e.pageX; mouseY = e.pageY; });
    (0, jquery_1.default)(window).on("beforeunload", function (e) {
        if (fs_winary.length > 0) {
            e.preventDefault();
            e.returnValue = "";
            return "";
        }
    }).on("unload", function () { closeChildWindows(); });
    //disable bootstrap modal auto close when click outside and ESC key
    let modal = jquery_1.default.fn.modal;
    if (modal) {
        try {
            //bootstrap v4
            modal.Constructor.Default.backdrop = "static";
            modal.Constructor.Default.keyboard = false;
        }
        catch (ex) {
            console.error(ex);
        }
    }
    try {
        //bootstrap 5
        bootstrap_1.Modal.Default.backdrop = "static";
        bootstrap_1.Modal.Default.keyboard = false;
    }
    catch (ex) {
        console.error(ex);
    }
    if (callback)
        setupApplication(callback);
}
exports.startApplication = startApplication;
function setupApplication(callback) {
    let reply = (0, messenger_1.requestAccessorInfo)(callback);
    console.log("request access info: ", reply);
}
exports.setupApplication = setupApplication;
function serializeParameters(parameters, addonParameters, raw) {
    if (addonParameters) {
        Object.assign(parameters, addonParameters);
    }
    let jsondata = {};
    let cipherdata = false;
    if (raw || (0, app_info_1.getDefaultRawParameters)()) {
        jsondata = parameters;
    }
    else {
        let dh = (0, messenger_1.getDH)();
        if (dh) {
            cipherdata = true;
            jsondata.ciphertext = dh.encrypt(JSON.stringify(parameters));
        }
        else {
            jsondata = parameters;
        }
    }
    console.log("serialize: parameters", JSON.stringify(parameters));
    console.log("serialize: jsondata", JSON.stringify(jsondata));
    let token = (0, messenger_1.getAccessorToken)();
    let key = (0, messenger_1.getAccessTokenKey)();
    let headers = { "authtoken": token, "tokenkey": key, "data-type": cipherdata ? "json/cipher" : "", language: (0, app_info_1.getDefaultLanguage)() || "EN" };
    //console.log("serialize: headers",JSON.stringify(headers));
    return { cipherdata: cipherdata, jsondata: JSON.stringify(jsondata), jsonobject: jsondata, headers: headers };
}
exports.serializeParameters = serializeParameters;
function decryptCipherData(headers, data) {
    let accepttype = headers["accept-type"];
    let dh = (0, messenger_1.getDH)();
    if (accepttype == "json/cipher") {
        let json = JSON.parse(data);
        if (dh && json.body.data && typeof json.body.data === "string") {
            let jsondatatext = dh.decrypt(json.body.data);
            console.log("decryptCipherData: jsondatatext", jsondatatext);
            let jsondata = JSON.parse(jsondatatext);
            json.body = jsondata;
            return json;
        }
    }
    if (dh && accepttype == "text/cipher") {
        let jsontext = dh.decrypt(data);
        console.log("decryptCipherData: jsontext", jsontext);
        if (jsontext) {
            let json = JSON.parse(jsontext);
            return json;
        }
    }
    return data;
}
exports.decryptCipherData = decryptCipherData;
function createLinkStyle(css_url) {
    if (css_url && css_url.trim().length > 0) {
        console.log("try to create link style:", css_url);
        try {
            let style = document.createElement('link');
            style.type = "text/css";
            style.rel = "stylesheet";
            style.href = css_url;
            document.head.appendChild(style);
        }
        catch (ex) {
            console.error(ex);
        }
    }
}
exports.createLinkStyle = createLinkStyle;
function disableControls() {
    (0, jquery_1.default)(arguments).each(function (index, element) {
        let $src = (0, jquery_1.default)(element);
        $src.attr("disabled", "true");
        setTimeout(function () {
            $src.removeAttr("disabled");
        }, 1000);
    });
}
exports.disableControls = disableControls;
function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    else {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
exports.generateUUID = generateUUID;
var fs_requestid = null;
function getRequestID() {
    if (!fs_requestid) {
        fs_requestid = generateUUID();
    }
    return fs_requestid;
}
exports.getRequestID = getRequestID;
