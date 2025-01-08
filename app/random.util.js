"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumber = exports.random = exports.getRandomNumber = exports.NUMERICS = exports.ALPHABETS = void 0;
exports.ALPHABETS = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
exports.NUMERICS = Array.from("0123456789");
function getRandomNumber(min = 1, max = 1000000) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.getRandomNumber = getRandomNumber;
function random(len = 6, alphabets = exports.ALPHABETS) {
    let result = "";
    let max = alphabets.length - 1;
    for (let i = 0; i < len; i++) {
        let idx = getRandomNumber(1, max);
        result += alphabets[idx - 1];
    }
    return result;
}
exports.random = random;
function randomNumber(len = 6, alphabets = exports.NUMERICS) {
    return random(len, alphabets);
}
exports.randomNumber = randomNumber;
