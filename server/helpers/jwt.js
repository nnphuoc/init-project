'use strict';

import JWT from 'jsonwebtoken';
import {jwtCredentials} from '../config/index';

export default class JWTHelper {

    static async sign(payload, expiresIn = 60 * 60 * 24 * 30) {
        return new Promise((resolve, reject) => {
            JWT.sign(
                payload,
                jwtCredentials.privateKey,
                {
                    algorithm: 'RS256',
                    expiresIn: expiresIn
                },
                (error, token) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(token);
                    }
                }
            )
        });
    }

    static async verify(token) {
        return new Promise((resolve, reject) => {
            JWT.verify(
                token,
                jwtCredentials.publicKey,
                {
                    algorithm: 'RS256'
                },
                (error, decoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                }
            )
        });
    }

    static getToken = (req) => {
        let authorization = null;
        let token = null;
        if (req.query && req.query.token) {
            return req.query.token;
        } else if (req.authorization) {
            authorization = req.authorization;
        } else if (req.headers) {
            authorization = req.headers.authorization;
        } else if (req.socket) {
            if (req.socket.handshake.query && req.socket.handshake.query.token) {
                return req.socket.handshake.query.token;
            }
            authorization = req.socket.handshake.headers.authorization;
        }
        if (authorization) {
            const tokens = authorization.split('Bearer ');
            if (Array.isArray(tokens) || tokens.length === 2) {
                token = tokens[1];
            }
        }
        return token;
    };

}
