import $ from "jquery";
import { getApiUrl } from "./app.info";
import { getRequestID, randomize } from "./app.util";
import { getAccessorInfo } from "./messenger";
import CryptoJS from "crypto-js";
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
    return Math.floor(randomize() * (max - min + 1) + min);
};
const getRandomPrime = function (min, max) {
    const primes = getPrimes(min, max);
    return primes[getRandomNum(0, primes.length - 1)];
};
export const getPrimeNumber = function () {
    return getRandomPrime(1000, 10000);
};
export function modPowInt(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp >>= 1n;
        base = (base * base) % mod;
    }
    return result;
}
export class DH {
    prime;
    generator;
    privateKey;
    publicKey;
    sharedKey;
    otherPublicKey;
    constructor() {
        this.prime = "" + getPrimeNumber();
        this.generator = "" + getPrimeNumber();
        this.privateKey = "" + getPrimeNumber();
        this.publicKey = "" + getPrimeNumber();
        this.sharedKey = "" + getPrimeNumber();
        this.otherPublicKey = "" + getPrimeNumber();
    }
    encryptText(word, keyBase64) {
        let key = CryptoJS.enc.Base64.parse(keyBase64);
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.toString();
    }
    decryptText(word, keyBase64) {
        let key = CryptoJS.enc.Base64.parse(keyBase64);
        let decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
    encrypt(word) {
        let hash = CryptoJS.SHA256(this.sharedKey);
        let keyBase64 = hash.toString(CryptoJS.enc.Base64);
        let key = CryptoJS.enc.Base64.parse(keyBase64);
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.toString();
    }
    decrypt(word) {
        let hash = CryptoJS.SHA256(this.sharedKey);
        let keyBase64 = hash.toString(CryptoJS.enc.Base64);
        let key = CryptoJS.enc.Base64.parse(keyBase64);
        let decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
    computePublicKey() {
        let G = BigInt(this.generator);
        let P = BigInt(this.prime);
        let a = BigInt(this.privateKey);
        let ap = modPowInt(G, a, P);
        this.publicKey = ap.toString();
    }
    computeSharedKey() {
        let P = BigInt(this.prime);
        let a = BigInt(this.privateKey);
        let bp = BigInt(this.otherPublicKey);
        let ashare = modPowInt(bp, a, P);
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
        return getAccessorInfo();
    }
    getAccessorToken() {
        let json = this.getAccessorInfo();
        if (json?.authtoken) {
            return json.authtoken;
        }
        return "";
    }
    getRequestID() {
        return getRequestID();
    }
    requestPublicKey(dh, callback, aurl) {
        if (!aurl)
            aurl = getApiUrl() + "/api/crypto/dh";
        let authtoken = this.getAccessorToken();
        let requestid = this.getRequestID();
        $.ajax({
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
            aurl = getApiUrl() + "/api/crypto/dh";
        let authtoken = this.getAccessorToken();
        let requestid = this.getRequestID();
        $.ajax({
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
            aurl = getApiUrl() + "/api/crypto/update";
        let authtoken = this.getAccessorToken();
        let requestid = this.getRequestID();
        $.ajax({
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
