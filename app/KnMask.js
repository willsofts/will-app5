"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnMask = void 0;
class KnMask {
    constructor(maskChar = "*") {
        this.maskChar = "*";
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
                else {
                    if (i >= maskLength) {
                        masked = masked.concat(maskChar);
                    }
                    else {
                        masked = masked.concat(c);
                    }
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
}
exports.KnMask = KnMask;
