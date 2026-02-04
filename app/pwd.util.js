import { randomize } from "./app.util";
export function randomPassword() {
    let now = new Date();
    let time = now.getTime().toString(16);
    time = time.substring(time.length - 4);
    let l = Math.floor(randomize() * 100000) + 1000;
    let code = l.toString(16);
    code = code.substring(0, 4);
    return time + code;
}
export function getAlphabets(text) {
    if (!text || text.trim().length == 0)
        return 0;
    let count = 0;
    for (let i = 0, isz = text.length; i < isz; i++) {
        if (isLetter(text.charAt(i))) {
            count++;
        }
    }
    return count;
}
export function getDigits(text) {
    if (!text || text.trim().length == 0)
        return 0;
    return (text.match(/\d/g) || []).length;
}
export function isDigit(c) {
    return c >= '0' && c <= '9';
}
export function isLetter(c) {
    return /[a-zA-Z]/.test(c);
}
export function isLowerCase(c) {
    return c == c.toLowerCase();
}
export function isUpperCase(c) {
    return c == c.toUpperCase();
}
export function indexOfAlphabets(text) {
    if (!text || text.trim().length == 0)
        return -1;
    for (let i = 0, isz = text.length; i < isz; i++) {
        if (isLetter(text.charAt(i))) {
            return i;
        }
    }
    return -1;
}
export function createNewPassword() {
    let text = randomPassword();
    let digits = getDigits(text);
    let letters = getAlphabets(text);
    while (digits == 0 || letters <= 1) {
        text = randomPassword();
        digits = getDigits(text);
        letters = getAlphabets(text);
    }
    let idx = indexOfAlphabets(text);
    if (idx >= 0) {
        let ch = text.charAt(idx);
        ch = ch.toUpperCase();
        return text.substring(0, idx) + ch + text.substring(idx + 1);
    }
    return text;
}
export function checkNumberOnly(text) {
    if (!text || text.trim().length == 0)
        return false;
    return /^\d*$/.test(text);
}
