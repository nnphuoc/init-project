'use strict';
import Request from 'request';

export default class ApiUtil {

    static async request(url, method, body, headers) {
        return new Promise((resolve, reject) => {
            Request({
                // headers: headers,
                uri: url,
                json: body,
                method: method
            }, (error, request, response) => {
                if (error) {
                    reject(error);
                } else {
                    try {
                        resolve(response);
                    } catch (e) {
                        reject(new Error('Cannot parse response from service'));
                    }
                }
            });
        });
    }
};
