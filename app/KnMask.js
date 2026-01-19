"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnMask = void 0;
class KnMask {
    maskChar = "*";
    constructor(maskChar = "*") {
        this.maskChar = maskChar;
    }
    /**
     * @param text The number in plain text
     * @param mask The mask pattern.
     *    Use # to include the digit from the position.
     *    Use x or * to mask the digit at that position.
     *    Any other char will be inserted.
     *
     * @return The masked string
     */
    static maskingNumber(text, mask = "####-xxxx-####", maskChar = "*") {
        let masked = "";
        if (text && text.trim().length > 0) {
            let index = 0;
            let length = text.length;
            for (let i = 0; i < mask.length; i++) {
                let c = mask.charAt(i);
                if (c == '#') {
                    if (index < length) {
                        masked = masked.concat(text.charAt(index));
                    }
                    index++;
                }
                else if (c == 'x' || c == 'X' || c == maskChar) {
                    masked = masked.concat(c);
                    index++;
                }
                else {
                    masked = masked.concat(c);
                }
            }
        }
        return masked;
    }
    /**
     * @param text The number in plain text
     * @param maskLength number of remaining original text
     * @param maskChar default is "*" to be masked
     * @return The masked string
     * ex. text = "1234567898765432"
     * after maskingHead(text,4) = ************5432
     * mask head but last 4 characters remain
     */
    static maskingHead(text, maskLength = 4, maskChar = "*") {
        let masked = "";
        if (text && text.trim().length > 0) {
            let length = text.length;
            let maskPoint = length - maskLength;
            for (let i = 0; i < length; i++) {
                let c = text.charAt(i);
                if (i >= maskPoint) {
                    masked = masked.concat(c);
                }
                else {
                    masked = masked.concat(maskChar);
                }
            }
        }
        return masked;
    }
    /**
     * @param text The number in plain text
     * @param maskLength number of remaining original text
     * @param maskChar default is "*" to be masked
     * @return The masked string
     * ex. text = "1234567898765432"
     * after maskingTail(text,4) = 1234************
     * mask tail (until end of string) but first 4 characters remain
     */
    static maskingTail(text, maskLength = 4, maskChar = "*") {
        let masked = "";
        if (text && text.trim().length > 0) {
            let length = text.length;
            for (let i = 0; i < length; i++) {
                let c = text.charAt(i);
                if (i >= maskLength) {
                    masked = masked.concat(maskChar);
                }
                else {
                    masked = masked.concat(c);
                }
            }
        }
        return masked;
    }
    /**
     * @param text The number in plain text
     * @param maskLength number of remaining original text
     * @param maskChar default is "*" to be masked
     * @return The masked string
     * ex. text = "1234567898765432"
     * after maskingHeadAndTail(text,4) = 1234********5432
     * mask head and tail (until end of string) but first & last 4 characters remain
     */
    static maskingHeadAndTail(text, maskLength = 4, maskChar = "*") {
        let masked = "";
        if (text && text.trim().length > 0) {
            let length = text.length;
            let maskPoint = length - maskLength;
            for (let i = 0; i < length; i++) {
                let c = text.charAt(i);
                if (i >= maskPoint) {
                    masked = masked.concat(c);
                }
                else if (i >= maskLength) {
                    masked = masked.concat(maskChar);
                }
                else {
                    masked = masked.concat(c);
                }
            }
        }
        return masked;
    }
    maskHead(text, maskLength = 4) {
        return KnMask.maskingHead(text, maskLength, this.maskChar);
    }
    maskNumber(text, mask = "####-xxxx-####") {
        return KnMask.maskingNumber(text, mask, this.maskChar);
    }
    maskTail(text, maskLength = 4) {
        return KnMask.maskingTail(text, maskLength, this.maskChar);
    }
    maskHeadAndTail(text, maskLength = 4) {
        return KnMask.maskingHeadAndTail(text, maskLength, this.maskChar);
    }
    maskSensitive(json, attributes = ["password", "pwd"]) {
        return KnMask.maskingSensitive(json, attributes);
    }
    maskSensitiveObject(json, attributes = ["password", "pwd"]) {
        return KnMask.maskingSensitiveObject(json, attributes);
    }
    maskAttribute(json, attributes = ["password", "pwd"]) {
        return KnMask.maskingAttribute(json, attributes);
    }
    maskAttributeObject(json, attributes = ["password", "pwd"]) {
        return KnMask.maskingAttributeObject(json, attributes);
    }
    /**
     * @param json object
     * @param attributes detected attributes, default is ["password","pwd"]
     * @return new deep clone object with detected attributes
     * ex. json = { name: "xxx", password: "yyy", userpwd: "1234" }
     * after maskingSensitive(json) = { name: 'xxx', password: undefined, userpwd: undefined }
     */
    static maskingSensitive(json, attributes = ["password", "pwd"]) {
        if (json) {
            const newjson = structuredClone(json);
            this.maskingSensitiveObject(newjson, attributes);
            return newjson;
        }
        return json;
    }
    /**
     * @param json object
     * @param attributes detected attributes, default is ["password","pwd"]
     * @return old object with detected attributes
     * ex. json = { name: "xxx", password: "yyy", userpwd: "1234" }
     * after maskingSensitiveObject(json) = { name: 'xxx', password: undefined, userpwd: undefined }
     */
    static maskingSensitiveObject(json, attributes = ["password", "pwd"]) {
        if (json) {
            let regex = new RegExp(attributes.join("|"), "i");
            for (let key of Object.keys(json)) {
                if (regex.test(key)) {
                    json[key] = undefined;
                }
                if (typeof json[key] === 'object') {
                    this.maskingSensitiveObject(json[key], attributes);
                }
            }
        }
    }
    /**
     * @param json object
     * @param attributes detected attributes, default is ["password","pwd"]
     * @return new deep clone object with detected attributes
     * ex. json = { name: "xxx", password: "yyy", userpwd: "1234" }
     * after maskingAttribute(json) = { name: 'xxx', password: '******', userpwd: '******' }
     */
    static maskingAttribute(json, attributes = ["password", "pwd"]) {
        if (json) {
            const newjson = structuredClone(json);
            this.maskingAttributeObject(newjson, attributes);
            return newjson;
        }
        return json;
    }
    /**
     * @param json object
     * @param attributes detected attributes, default is ["password","pwd"]
     * @return old object with detected attributes
     * ex. json = { name: "xxx", password: "yyy", userpwd: "1234" }
     * after maskingAttributeObject(json) = { name: 'xxx', password: '******', userpwd: '******' }
     */
    static maskingAttributeObject(json, attributes = ["password", "pwd"], mask = "******") {
        if (json) {
            let regex = new RegExp(attributes.join("|"), "i");
            for (let key of Object.keys(json)) {
                if (regex.test(key)) {
                    json[key] = mask;
                }
                if (typeof json[key] === 'object') {
                    this.maskingAttributeObject(json[key], attributes);
                }
            }
        }
    }
}
exports.KnMask = KnMask;
