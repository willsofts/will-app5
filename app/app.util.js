import $ from "./jquery.util";
import bootbox from "../bootbox/bootbox";
import { Modal } from "bootstrap";
import { getMessageCode } from "./msg.util";
import { getAccessorToken, requestAccessorInfo, getDH, getAccessTokenKey } from "./messenger";
import { getDefaultRawParameters, getDefaultLanguage } from "./app.info";
const fs_winary = new Array();
export function getWindowByName(winname) {
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
export function closeChildWindows() {
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
export function addWindow(awindow) {
    if (!awindow)
        return;
    fs_winary.push(awindow);
}
export function buildFormParams(frm, params) {
    if (typeof (params) === "string") {
        let prms = params.split("&");
        for (let prm of prms) {
            let kary = prm.split("=");
            let inp = $('<input type="hidden" name="' + kary[0] + '"></input>');
            inp.val(kary[1]);
            frm.append(inp);
        }
    }
    else if (Array.isArray(params)) {
        for (let prm of params) {
            if (prm.name) {
                let inp = $('<input type="hidden" name="' + prm.name + '"></input>');
                inp.val(prm.value);
                frm.append(inp);
            }
        }
    }
    else if (params) {
        for (let prm in params) {
            let inp = $('<input type="hidden" name="' + prm + '"></input>');
            inp.val(params[prm]);
            frm.append(inp);
        }
    }
}
export function submitWindow(settings) {
    let p = settings;
    if ((p.url && p.url != "") && p.params) {
        let method = p.method || "POST";
        let frm = $("<form method='" + method + "'></form>");
        frm.attr("action", p.url);
        frm.attr("target", p.windowName);
        buildFormParams(frm, p.params);
        let layer = $("<div class='open-new-window-submit-layer'></div>");
        layer.append(frm);
        $("body").append(layer);
        frm.trigger("submit");
        setTimeout(function () { layer.remove(); }, 1500);
    }
}
export function openNewWindow(settings) {
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
    let p = { ...defaultSettings, ...settings };
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
        fs_window.opener = globalThis;
    try {
        addWindow(fs_window);
    }
    catch (ex) {
        console.error(ex);
    }
    submitWindow(p);
    return fs_window;
}
export function startWaiting() {
    try {
        let dc = $(document.body);
        let sh = dc.innerHeight();
        let fslayer = $("#fswaitlayer");
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
export function stopWaiting() {
    $("#fswaitlayer").hide();
}
export function submitFailure(xhr, status, errorThrown, checking = true) {
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
export function parseErrorThrown(xhr, status, errorThrown) {
    if (!errorThrown || errorThrown == xhr.status) {
        errorThrown = xhr.responseText;
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
export function detectErrorResponse(data) {
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
export function successbox(callback, params) {
    let title = getMessageCode("fsinfo", undefined, "Information");
    alertbox("QS0004", callback, undefined, params, undefined, title, "fa fa-info-circle");
}
export function warningbox(errcode, callback, params) {
    let title = getMessageCode("fswarn", undefined, "Warning");
    alertbox(errcode, callback, undefined, params, undefined, title, "fas fa fa-exclamation-circle");
}
export function alertbox(errcode, callback, defaultmsg, params, addonmsg, title, icon) {
    if (!title || title.trim().length == 0)
        title = getMessageCode("fsalert", undefined, "Alert");
    let txt = getMessageCode(errcode, params);
    if (txt != null && txt != "") {
        if (addonmsg)
            txt += " " + addonmsg;
        alertDialog(txt, callback, title, icon);
    }
    else if (defaultmsg) {
        if (addonmsg)
            defaultmsg += " " + addonmsg;
        alertDialog(defaultmsg, callback, title, icon);
    }
    else {
        alertDialog(errcode, callback, title, icon);
    }
}
export function alertDialog(msg, callbackfn, title = "Alert", icon = "fa fa-bell-o fas fa-bell") {
    if (!msg) {
        console.log("alertDialog: msg undefined");
        return;
    }
    try {
        let fs_okbtn = getMessageCode("fsokbtn", undefined, "OK");
        let box = globalThis.bootbox;
        if (!box)
            box = bootbox;
        box.alert({
            title: "<em class='" + icon + "'></em>&nbsp;<label>" + title + "</label>",
            message: msg,
            callback: function () {
                if (callbackfn)
                    callbackfn();
            },
            backdrop: false,
            buttons: {
                ok: { label: fs_okbtn }
            }
        });
        let dialog = $(".bootbox > .modal-dialog");
        dialog.draggable();
        return;
    }
    catch (ex) {
        console.error(ex);
    }
    if (callbackfn)
        callbackfn();
}
export function confirmbox(errcode, okFn, cancelFn, defaultmsg, params, addonmsg, title, icon) {
    if (!title || title.trim().length == 0)
        title = getMessageCode("fsconfirm", undefined, "Confirmation");
    let txt = getMessageCode(errcode, params);
    if (txt != null && txt != "") {
        if (addonmsg)
            txt += " " + addonmsg;
        return confirmDialog(txt, okFn, cancelFn, title, icon);
    }
    else if (defaultmsg) {
        if (addonmsg)
            defaultmsg += " " + addonmsg;
        return confirmDialog(defaultmsg, okFn, cancelFn, title, icon);
    }
    else {
        return confirmDialog(errcode, okFn, cancelFn, title, icon);
    }
}
export function confirmDialog(msg, okCallback, cancelCallback, title = "Confirmation", icon = "fas fa fa-question-circle") {
    try {
        let fs_confirmbtn = getMessageCode("fsconfirmbtn", undefined, "OK");
        let fs_cancelbtn = getMessageCode("fscancelbtn", undefined, "Cancel");
        let box = globalThis.bootbox ?? bootbox;
        box.confirm({
            title: "<em class='" + icon + "'></em>&nbsp;<label>" + title + "</label>",
            message: msg,
            callback: function (result) {
                if (result) {
                    if (okCallback)
                        okCallback();
                }
                else if (cancelCallback) {
                    cancelCallback();
                }
            },
            backdrop: false,
            swapButtonOrder: true,
            buttons: {
                confirm: { label: fs_confirmbtn },
                cancel: { label: fs_cancelbtn },
            }
        });
        let dialog = $(".bootbox > .modal-dialog");
        dialog.draggable();
    }
    catch (ex) {
        console.error(ex);
    }
    return true;
}
export function alertmsg(errcode, defaultmsg, params, callback) {
    alertbox(errcode, callback, defaultmsg, params);
}
export function confirmmsg(errcode, defaultmsg, params, okFn, cancelFn) {
    confirmbox(errcode, okFn, cancelFn, defaultmsg, params);
}
export function confirmDialogBox(errcode, params, defaultmsg, okFn, cancelFn, addonmsg) {
    return confirmbox(errcode, okFn, cancelFn, defaultmsg, params, addonmsg);
}
export function confirmDelete(params, okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0001", params, "Do you want to delete this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmSave(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0002", null, "Do you want to save this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmCancel(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0003", null, "Do you want to cancel this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmRemove(params, okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0005", params, "Do you want to delete this record?", okFn, cancelFn, addonmsg);
}
export function confirmSend(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0006", null, "Do you want to send this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmUpdate(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0007", null, "Do you want to update this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmClear(params, okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0008", params, "Do you want to clear this?", okFn, cancelFn, addonmsg);
}
export function confirmProcess(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0009", null, "Do you want to process this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmSaveAs(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0010", null, "Do you want to save as this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmReceive(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0011", null, "Do you want to receive this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmReset(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0012", null, "Do you want to reset this trasaction?", okFn, cancelFn, addonmsg);
}
export function confirmErase(params, okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0013", params, "Do you want to delete %s row(s)?", okFn, cancelFn, addonmsg);
}
export function confirmApprove(params, okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0014", params, "Do you want to confirm approve the %s request?", okFn, cancelFn, addonmsg);
}
export function confirmReject(params, okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0015", params, "Do you want to reject %s?", okFn, cancelFn, addonmsg);
}
export function confirmRequest(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0016", null, "Do you want to create this request?", okFn, cancelFn, addonmsg);
}
export function confirmImport(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0017", null, "Do you want to import this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmExport(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0018", null, "Do you want to export this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmResend(okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0019", null, "Do you want to resend this transaction?", okFn, cancelFn, addonmsg);
}
export function confirmRevise(params, okFn, cancelFn, addonmsg) {
    return confirmDialogBox("QS0020", params, "Do you want to revise the transaction?", okFn, cancelFn, addonmsg);
}
let mouseX = 0;
let mouseY = 0;
export function startApplication(pid, callback) {
    console.log("startApplication: pid=" + pid);
    $(document).on("mousedown", function (e) { mouseX = e.pageX; mouseY = e.pageY; });
    $(globalThis).on("beforeunload", function (e) {
        if (fs_winary.length > 0) {
            e.preventDefault();
            e.returnValue = "";
            return "";
        }
    }).on("unload", function () { closeChildWindows(); });
    //disable bootstrap modal auto close when click outside and ESC key
    let modal = $?.fn?.modal;
    if (!modal)
        modal = globalThis.jQuery?.fn?.modal;
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
        Modal.Default.backdrop = "static";
        Modal.Default.keyboard = false;
    }
    catch (ex) {
        console.error(ex);
    }
    if (callback)
        setupApplication(callback);
}
export function setupApplication(callback) {
    let reply = requestAccessorInfo(callback);
    console.log("request access info: ", reply);
}
export function serializeParameters(parameters, addonParameters, raw) {
    if (addonParameters) {
        Object.assign(parameters, addonParameters);
    }
    let jsondata = {};
    let cipherdata = false;
    if (raw || getDefaultRawParameters()) {
        jsondata = parameters;
    }
    else {
        let dh = getDH();
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
    let token = getAccessorToken();
    let key = getAccessTokenKey();
    let headers = { "authtoken": token, "tokenkey": key, "data-type": cipherdata ? "json/cipher" : "", language: getDefaultLanguage() || "EN" };
    return { cipherdata: cipherdata, jsondata: JSON.stringify(jsondata), jsonobject: jsondata, headers: headers };
}
export function decryptCipherData(headers, data) {
    let accepttype = headers["accept-type"];
    let dh = getDH();
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
export function createLinkStyle(css_url) {
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
export function disableControls() {
    $(arguments).each(function (index, element) {
        let $src = $(element);
        $src.attr("disabled", "true");
        setTimeout(function () {
            $src.removeAttr("disabled");
        }, 1000);
    });
}
export function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    else {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, function (c) {
            const r = Math.trunc(randomize() * 16);
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
let fs_requestid = null;
export function getRequestID() {
    if (!fs_requestid) {
        fs_requestid = generateUUID();
    }
    return fs_requestid;
}
export function resetRequestID() {
    fs_requestid = null;
}
export function randomize() {
    const cryptoObj = globalThis.crypto ?? globalThis.msCrypto;
    let array = new Uint32Array(1);
    cryptoObj.getRandomValues(array);
    return array[0] / (0xFFFFFFFF + 1);
}
