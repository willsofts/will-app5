"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DH = void 0;
const jquery_1 = __importDefault(require("jquery"));
const app_info_1 = require("./app.info");
const messenger_1 = require("./messenger");
const crypto_js_1 = __importDefault(require("crypto-js"));
const bigi_1 = __importDefault(require("bigi"));
const getPrimes = function (min, max) {
    const result = Array(max + 1).fill(0).map((_, i) => i);
    for (let i = 2; i <= Math.sqrt(max + 1); i++) {
        for (let j = i ** 2; j < max + 1; j += i)
            delete result[j];
    }
    return Object.values(result.slice(min));
};
const getRandomNum = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const getRandomPrime = function (min, max) {
    const primes = getPrimes(min, max);
    return primes[getRandomNum(0, primes.length - 1)];
};
const getPrimeNumber = function () {
    return getRandomPrime(1000, 10000);
};
class DH {
    constructor() {
        this.prime = "" + getPrimeNumber();
        this.generator = "" + getPrimeNumber();
        this.privateKey = "" + getPrimeNumber();
        this.publicKey = "" + getPrimeNumber();
        this.sharedKey = "" + getPrimeNumber();
        this.otherPublicKey = "" + getPrimeNumber();
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
        if (json && json.authtoken) {
            return json.authtoken;
        }
        return "";
    }
    requestPublicKey(dh, callback, aurl) {
        if (!aurl)
            aurl = (0, app_info_1.getApiUrl)() + "/api/crypto/dh";
        let authtoken = this.getAccessorToken();
        jquery_1.default.ajax({
            url: aurl,
            type: "POST",
            dataType: "json",
            headers: { "authtoken": authtoken },
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
        jquery_1.default.ajax({
            url: aurl,
            type: "POST",
            data: {
                publickey: this.publicKey
            },
            dataType: "json",
            headers: { "authtoken": authtoken },
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
        jquery_1.default.ajax({
            url: aurl,
            type: "POST",
            data: {
                publickey: this.publicKey
            },
            dataType: "json",
            headers: { "authtoken": authtoken },
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
