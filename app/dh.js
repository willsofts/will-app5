"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DH = exports.getPrimeNumber = void 0;
const jquery_1 = __importDefault(require("jquery"));
const app_info_1 = require("./app.info");
const app_util_1 = require("./app.util");
const messenger_1 = require("./messenger");
const crypto_js_1 = __importDefault(require("crypto-js"));
const bigi_1 = __importDefault(require("bigi"));
const getPrimes = function (min, max) {
    const isPrime = new Array(max + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    for (let i = 2; i <= Math.sqrt(max); i++) {
        if (isPrime[i]) {
            for (let j = i * i; j <= max; j += i) {
                isPrime[j] = false;
            }
        }
    }
    const result = [];
    for (let i = Math.max(min, 2); i <= max; i++) {
        if (isPrime[i]) {
            result.push(i);
        }
    }
    return result;
};
const getRandomNum = function (min, max) {
    return Math.floor((0, app_util_1.randomize)() * (max - min + 1) + min);
};
const getRandomPrime = function (min, max) {
    const primes = getPrimes(min, max);
    return primes[getRandomNum(0, primes.length - 1)];
};
const getPrimeNumber = function () {
    return getRandomPrime(1000, 10000);
};
exports.getPrimeNumber = getPrimeNumber;
class DH {
    prime;
    generator;
    privateKey;
    publicKey;
    sharedKey;
    otherPublicKey;
    constructor() {
        this.prime = "" + (0, exports.getPrimeNumber)();
        this.generator = "" + (0, exports.getPrimeNumber)();
        this.privateKey = "" + (0, exports.getPrimeNumber)();
        this.publicKey = "" + (0, exports.getPrimeNumber)();
        this.sharedKey = "" + (0, exports.getPrimeNumber)();
        this.otherPublicKey = "" + (0, exports.getPrimeNumber)();
    }
    encryptText(word, keyBase64) {
        let key = crypto_js_1.default.enc.Base64.parse(keyBase64);
        let srcs = crypto_js_1.default.enc.Utf8.parse(word);
        let encrypted = crypto_js_1.default.AES.encrypt(srcs, key, { mode: crypto_js_1.default.mode.ECB, padding: crypto_js_1.default.pad.Pkcs7 });
        return encrypted.toString();
    }
    decryptText(word, keyBase64) {
        let key = crypto_js_1.default.enc.Base64.parse(keyBase64);
        let decrypt = crypto_js_1.default.AES.decrypt(word, key, { mode: crypto_js_1.default.mode.ECB, padding: crypto_js_1.default.pad.Pkcs7 });
        return crypto_js_1.default.enc.Utf8.stringify(decrypt).toString();
    }
    encrypt(word) {
        let hash = crypto_js_1.default.SHA256(this.sharedKey);
        let keyBase64 = hash.toString(crypto_js_1.default.enc.Base64);
        let key = crypto_js_1.default.enc.Base64.parse(keyBase64);
        let srcs = crypto_js_1.default.enc.Utf8.parse(word);
        let encrypted = crypto_js_1.default.AES.encrypt(srcs, key, { mode: crypto_js_1.default.mode.ECB, padding: crypto_js_1.default.pad.Pkcs7 });
        return encrypted.toString();
    }
    decrypt(word) {
        let hash = crypto_js_1.default.SHA256(this.sharedKey);
        let keyBase64 = hash.toString(crypto_js_1.default.enc.Base64);
        let key = crypto_js_1.default.enc.Base64.parse(keyBase64);
        let decrypt = crypto_js_1.default.AES.decrypt(word, key, { mode: crypto_js_1.default.mode.ECB, padding: crypto_js_1.default.pad.Pkcs7 });
        return crypto_js_1.default.enc.Utf8.stringify(decrypt).toString();
    }
    computePublicKey() {
        let G = new bigi_1.default(this.generator, undefined, undefined);
        let P = new bigi_1.default(this.prime, undefined, undefined);
        let a = new bigi_1.default(this.privateKey, undefined, undefined);
        let ap = G.modPowInt(a, P);
        this.publicKey = ap.toString();
    }
    computeSharedKey() {
        let P = new bigi_1.default(this.prime, undefined, undefined);
        let a = new bigi_1.default(this.privateKey, undefined, undefined);
        let bp = new bigi_1.default(this.otherPublicKey, undefined, undefined);
        let ashare = bp.modPowInt(a, P);
        this.sharedKey = ashare.toString();
    }
    compute() {
        this.computePublicKey();
        this.computeSharedKey();
    }
    requestGenerator(callback, aurl) {
        this.requestPublicKey(this, callback, aurl);
    }
    getAccessorInfo() {
        return (0, messenger_1.getAccessorInfo)();
    }
    getAccessorToken() {
        let json = this.getAccessorInfo();
        if (json?.authtoken) {
            return json.authtoken;
        }
        return "";
    }
    getRequestID() {
        return (0, app_util_1.getRequestID)();
    }
    requestPublicKey(dh, callback, aurl) {
        if (!aurl)
            aurl = (0, app_info_1.getApiUrl)() + "/api/crypto/dh";
        let authtoken = this.getAccessorToken();
        let requestid = this.getRequestID();
        jquery_1.default.ajax({
            url: aurl,
            type: "POST",
            dataType: "json",
            headers: { "authtoken": authtoken, "x-request-id": requestid },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            error: (transport, status, errorThrown) => {
                console.log(errorThrown);
                if (callback)
                    callback(false, errorThrown);
            },
            success: (data, status, transport) => {
                console.log(transport.responseText);
                if (dh && data.body.info) {
                    let info = data.body.info;
                    dh.prime = info.prime;
                    dh.generator = info.generator;
                    dh.otherPublicKey = info.publickey;
                    dh.compute();
                    dh.submitPublicKey();
                }
                if (callback)
                    callback(true, data, transport);
            }
        });
    }
    submitPublicKey(callback, aurl) {
        if (!aurl)
            aurl = (0, app_info_1.getApiUrl)() + "/api/crypto/dh";
        let authtoken = this.getAccessorToken();
        let requestid = this.getRequestID();
        jquery_1.default.ajax({
            url: aurl,
            type: "POST",
            data: {
                publickey: this.publicKey
            },
            dataType: "json",
            headers: { "authtoken": authtoken, "x-request-id": requestid },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            error: (transport, status, errorThrown) => {
                console.log(errorThrown);
                if (callback)
                    callback(false, errorThrown);
            },
            success: (data, status, transport) => {
                console.log(transport.responseText);
                if (callback)
                    callback(true, transport);
            }
        });
    }
    updatePublicKey(callback, aurl) {
        if (!aurl)
            aurl = (0, app_info_1.getApiUrl)() + "/api/crypto/update";
        let authtoken = this.getAccessorToken();
        let requestid = this.getRequestID();
        jquery_1.default.ajax({
            url: aurl,
            type: "POST",
            data: {
                publickey: this.publicKey
            },
            dataType: "json",
            headers: { "authtoken": authtoken, "x-request-id": requestid },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            error: (transport, status, errorThrown) => {
                console.log(errorThrown);
                if (callback)
                    callback(false, errorThrown);
            },
            success: (data, status, transport) => {
                console.log(transport.responseText);
                if (callback)
                    callback(true, transport);
            }
        });
    }
}
exports.DH = DH;
