'use strict';

import aqp from 'api-query-params';

import { User } from '../models';
import { JWT, Response } from '../helpers';

export default class ControllerUser {

    static async getAllByAdmin (req, res, next) {
        try {
            let { filter, skip, limit, sort } = aqp(req.query, {
                skipKey: 'page'
            });
            const results = await User.paginate(filter, {
                select: '-password',
                page: skip || 1,
                limit: limit || 25,
                sort: sort,
                lean: true
            });
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async getOne (req, res, next) {
        try {
            const user = await User.findById(req.user._id).select('-password -role').lean();
            return Response.success(res, user);
        } catch (e) {
            return next(e);
        }
    }

    static async login (req, res, next) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username }).select('password role');
            if (!user) {
                return next(new Error('USER_NOT_FOUND'));
            }
            const checkPassword = await user.verifyPassword(password);
            if (!checkPassword) {
                return next(new Error('USER_INCORRECT'));
            }
            const token = await JWT.sign({
                user: {
                    _id: user._id,
                    role: user.role
                }
            });
            return Response.success(res, {
                access_token: token,
                role: user.role
            });
        } catch (e) {
            return next(e);
        }
    }

    static async create (req, res, next) {
        try {
            const { username, password } = req.body;
            const verifyUser = await User.findOne({ username }).select('_id').lean();
            if (verifyUser) {
                return next(new Error('USERNAME_USED'));
            }
            const user = await User.create({
                username,
                password
            });
            delete user._doc.password;
            return Response.success(res, user);
        } catch (e) {
            return next(e);
        }
    }

    static async update (req, res, next) {
        try {
            const result = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true }).select('-password -role');
            if (!result) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async becomeTeacher (req, res, next) {
        try {
            const result = await User.updateOne({ _id: req.params.id }, { $set: { role: User.ROLE.TEACHER }});
            if (result.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async changePassword (req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return next(new Error('MISSING_PARAMS'));
            }
            const user = await User.findOne({ _id: req.user._id }).select('password');
            if (!user) {
                return next(new Error('USER_NOT_FOUND'));
            }
            const checkPassword = await user.verifyPassword(oldPassword);
            if (!checkPassword) {
                return next(new Error('PASSWORD_INCORRECT'));
            }
            user.password = newPassword;
            await user.save();
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async delete (req, res, next) {
        try {
            const deleted = await User.deleteById(req.params.id);
            if (deleted.nModified === 0) {
                return next(new Error('ACTION_FAILED'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

}