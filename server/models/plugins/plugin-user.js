'use strict';

import BCrypt from 'bcrypt';

async function hashPassword (next) {
    if (this.isModified('password')) {
        this.password = await BCrypt.hash(this.password, 8);
        this['changePasswordAt'] = new Date();
    } else if (this._update && this._update['$set'] && this._update['$set'].password) {
        this._update['$set'].password = await BCrypt.hash(this._update['$set'].password, 8);
        this._update['$set']['changePasswordAt'] = new Date();
    }
    return next();
}

export default function (schema, options) {

    schema.pre('save', hashPassword);
    // schema.pre('update', hashPassword);
    schema.pre('create', hashPassword);
    // schema.pre('updateOne', hashPassword);
};