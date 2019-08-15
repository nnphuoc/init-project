'use strict';

import { JWT } from '../helpers';

export default class AuthMiddleware {
    static isAuth = async (req, res, next) => {
        try {
            const token = JWT.getToken(req);
            if (!token) {
                return next(new Error('AUTHENTICATION_FAILED'));
            }
            return await AuthMiddleware.verifyToken(token, req, res, next);
        } catch (error) {
            return next(error);
        }
    };

    static isOptionalAuth = async (req, res, next) => {
        try {
            const token = JWT.getToken(req);
            if (!token) {
                return next();
            }
            return await AuthMiddleware.verifyToken(token, req, res, next);
        } catch (e) {
            return next(e);
        }
    };

    static verifyToken = async (token, req, res, next) => {
        try {
            const verifyUser = await AuthMiddleware.verifyUserFromToken(token);
            req.user = verifyUser.user;
            if (next) {
                return next();
            }
        } catch (e) {
            return next(e);
        }
    };

    static verifyUserFromToken = async (token, option) => {
        const verifiedData = await JWT.verify(token, option);
        return {
            ...verifiedData
        };
    };
}
