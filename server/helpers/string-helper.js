'use strict';

import RandomString from 'randomstring';
import Crypto from 'crypto';

export default class StringHelper {

    static createCryptoHash(algorithm, key) {
        return Crypto.createHash(algorithm)
            .update(key)
            .digest('hex');
    }

    static genSignature(algorithm, key) {
        const signature = StringHelper.createCryptoHash(algorithm, key);
        return `${algorithm}=${signature}`
    };

    static generateStringNumber(length = 6) {
        return RandomString.generate({
            length,
            charset: 'numeric'
        });
    }
}
