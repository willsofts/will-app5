import $ from "jquery";
import { Utilities } from "./Utilities";
export function getControlClasses(attrClass, ...classes) {
    let ctrlClasses = "";
    if (!attrClass)
        attrClass = "";
    for (let c of classes) {
        if (!attrClass.includes(c))
            ctrlClasses += " " + c;
    }
    return ctrlClasses;
}
export function clearCalendar(src) {
    let dpkr = $(src);
    if (dpkr.is(":disabled"))
        return;
    if (dpkr.is("[readonly]")) {
        let edit = dpkr.attr("editable");
        if ("true" != edit)
            return;
    }
    dpkr.val("");
    src.dispatchEvent(new Event('select'));
    let ifn = dpkr.data("afterSelectDatePicker");
    if (ifn)
        ifn("", dpkr);
}
export function openCalendar(src) {
    let dpkr = $(src);
    if (dpkr.is(":disabled"))
        return;
    if (dpkr.is("[readonly]")) {
        let edit = dpkr.attr("editable");
        if ("true" != edit)
            return;
    }
    try {
        let picker = dpkr;
        picker.datepicker({
            showOn: "",
            dateFormat: "dd/mm/yy",
            changeMonth: true,
            changeYear: true,
            yearRange: "c-100:+100",
            onSelect: function (input, inst) {
                src.focus();
                src.dispatchEvent(new Event('select'));
                let fn = dpkr.data("afterSelectDatePicker");
                if (fn)
                    fn(input, inst);
            }
        });
        picker.datepicker("show");
        $(document).off('focusin');
        return;
    }
    catch (ex) {
        console.error(ex);
    }
}
export function triggerInput(input) {
    input.dispatchEvent(new Event('input', { bubbles: true }));
}
export function inputNumberOnly(myfield, e, decimal, isPlus) {
    let key;
    if (e)
        key = e.which;
    else
        return true;
    let keychar = String.fromCodePoint(key);
    let element = myfield;
    isPlus = Boolean(isPlus);
    let isPoint = decimal !== null && decimal !== undefined && Number(decimal) !== 0;
    if (key == 45 && !element.value.includes('-') && !isPlus) {
        element.value = "-" + element.value;
        triggerInput(element);
    }
    if ((key == 46) && !element.value.includes('.') && isPoint) {
        if (element.value == "")
            element.value = '0';
        triggerInput(element);
        return true;
    }
    if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 27))
        return true;
    else if ("0123456789".includes(keychar)) {
        triggerInput(element);
        return true;
    }
    else
        return false;
}
export function checkInputNumberOnly(myfield, e, decimal, isPlus) {
    let iskeyup = myfield.getAttribute('keyup');
    if (iskeyup === "false") {
        return false;
    }
    myfield.setAttribute('keyup', "false");
    return inputNumberOnly(myfield, e, decimal, isPlus);
}
export function checkInputKey(myfield, event, decimal, maxvalue) {
    let iNum = event.keyCode;
    if (((iNum >= 48) && (iNum <= 57)) || ((iNum >= 96) && (iNum <= 105)) || iNum == 109 || iNum == 110 || iNum == 189 || iNum == 190) {
        myfield.setAttribute('keyup', true);
        let c_pos = getCaretPosition(myfield);
        let o_len = myfield.value.length;
        formatNumber(myfield, maxvalue, decimal);
        let n_len = myfield.value.length;
        setCaretPosition(myfield, n_len > o_len ? c_pos + 1 : c_pos);
        triggerInput(myfield);
    }
}
export function cleasingValues(element, valueBfChange, fraction, point, data) {
    data = clearComma(data);
    try {
        let dot = '';
        let x = data.split('.');
        if (x.length == 2 && point > 0) {
            dot = (x[1].length > point) ? ('.' + x[1].substring(0, point)) : ('.' + x[1]);
        }
        while (x[0].length > 1 && x[0].charAt(0) == "0") {
            x[0] = x[0].substring(1);
        }
        if ((fraction == 0 && Number(x[0]) > 0) || (fraction > 0 && x[0].length > fraction)) {
            return [valueBfChange, true];
        }
        data = x[0] + dot;
    }
    catch (ex) {
        console.error(ex);
    }
    return [data, false];
}
export function formatNumber(element, maxvalue, decimal) {
    let valueBfChange = element.value;
    let data = element.value;
    let point = 0;
    if (decimal) {
        let precisions = Number(decimal);
        point = (precisions >= 0) ? precisions : 2;
    }
    let fraction = null;
    let mxvalue = maxvalue ? Number(maxvalue) : -1;
    if (mxvalue >= 0) {
        fraction = mxvalue;
        if (data.includes("-"))
            fraction++;
    }
    let unchanged = false;
    [data, unchanged] = cleasingValues(element, valueBfChange, fraction, point, data);
    element.value = unchanged ? data : putComma(data);
}
export function putComma(data) {
    if (data.includes(',')) {
        data = clearComma(data);
    }
    let move = (data.includes('.')) ? data.indexOf('.') : data.length;
    let minus = (data.includes('-')) ? 1 : 0;
    while (move > 3) {
        if (minus && move <= 4) {
            break;
        }
        data = data.substring(0, move - 3) + "," + data.substring(move - 3);
        move -= 3;
    }
    return data;
}
export function clearComma(data) {
    while (data.includes(',')) {
        data = data.replaceAll(',', '');
    }
    return data;
}
export function getCaretPosition(ctrl) {
    let iCaretPos = 0;
    if (document.selection) {
        ctrl.focus();
        let selector = document.selection.createRange();
        selector.moveStart('character', -ctrl.value.length);
        iCaretPos = selector.text.length;
    }
    else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        iCaretPos = ctrl.selectionStart;
    }
    return (iCaretPos);
}
export function setCaretPosition(ctrl, iCaretPos) {
    if (ctrl.createTextRange) {
        let selector = ctrl.createTextRange();
        selector.collapse(true);
        selector.moveEnd('character', iCaretPos);
        selector.moveStart('character', iCaretPos);
        selector.select();
    }
    else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        ctrl.selectionStart = iCaretPos;
        ctrl.selectionEnd = iCaretPos;
        ctrl.focus();
    }
}
export function parseNumber(avalue) {
    if (!avalue)
        return 0;
    return Number(removeComma(avalue));
}
export function removeComma(avalue) {
    if (!avalue)
        return avalue;
    let result = avalue + "";
    while (result.includes(",")) {
        result = removeDelimiter(result, ",");
    }
    return result;
}
export function removeDelimiter(avalue, delimiter) {
    return avalue.replace(delimiter, "");
}
export function formatFloating(avalue, decimal) {
    avalue = avalue + "";
    avalue = removeComma(avalue);
    return formatDecimal(avalue, decimal, true);
}
function resolveDecimalSign(avalue) {
    let sign = "";
    let result = avalue + "";
    let i = result.indexOf("-");
    if (i >= 0) {
        sign = "-";
        result = result.substring(i + 1);
    }
    else {
        i = result.indexOf("+");
        if (i >= 0) {
            sign = "+";
            result = result.substring(i + 1);
        }
    }
    return [result, sign];
}
function resolveDecimalString(avalue) {
    let cstr = "";
    let bstr = "";
    let astr = avalue;
    let i = avalue.indexOf(".");
    if (i > 0) {
        astr = avalue.substring(0, i);
        bstr = avalue.substring(i + 1);
        cstr = avalue.substring(i);
    }
    let la = astr.length;
    if (la > 3) {
        let tstr = astr;
        astr = "";
        while (tstr != "") {
            la = tstr.length;
            let md = la % 3;
            if (md > 0) {
                astr += tstr.substring(0, md) + ",";
                tstr = tstr.substring(md);
            }
            else {
                astr += tstr.substring(0, 3);
                tstr = tstr.substring(3);
                if (tstr != "")
                    astr += ",";
            }
        }
    }
    return [astr, bstr, cstr];
}
export function formatDecimal(avalue, decimal, verifydecimal) {
    let [result, sign] = resolveDecimalSign(avalue);
    let [astr, bstr, cstr] = resolveDecimalString(result);
    if (!verifydecimal) {
        return sign + astr + cstr;
    }
    if (decimal <= 0) {
        return sign + astr;
    }
    if (astr == "")
        return "";
    let l = bstr.length;
    if (decimal > l) {
        let j = 0;
        for (j = l; j < decimal; j++) {
            bstr += "0";
        }
    }
    else {
        bstr = bstr.substring(0, decimal);
    }
    return sign + astr + "." + bstr;
}
const header_action = { type: "button", action: "edit" };
export function ensureTableSetting(settings) {
    let headers = { autoFormat: true, ...settings };
    if (headers.actions) {
        for (let act of headers.actions) {
            let item = { ...header_action, ...act };
            if (!item.css && "button" == item.type) {
                if ("edit" == item.action) {
                    item.css = "btn-edit fa-data-edit fa-btn fa fa-pencil";
                }
                else if ("delete" == item.action) {
                    item.css = "btn-delete fa-data-delete fa-btn fa fa-trash";
                }
                else if ("view" == item.action) {
                    item.css = "btn-view fa-data-view fa-btn fa fa-eye";
                }
            }
            Object.assign(act, item);
        }
    }
    return headers;
}
export function formatDataTable(data, field) {
    try {
        if (field) {
            if (field.type == "DECIMAL") {
                return formatFloating(data, field.decimal === undefined ? 2 : field.decimal);
            }
            else if (field.type == "DATE") {
                let date = Utilities.parseDate(data);
                if (date)
                    return Utilities.formatDate(date);
            }
            else if (field.type == "DATETIME") {
                let date = Utilities.parseDate(data);
                if (date)
                    return Utilities.formatDateTime(date);
            }
        }
        return data;
    }
    catch (ex) {
        console.error(ex);
        return data;
    }
}
