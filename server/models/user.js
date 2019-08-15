'use strict';

import Mongoose, { Schema } from 'mongoose';
import MongoosePaginate from 'mongoose-paginate';
import MongooseDelete from 'mongoose-delete';
import PluginUser from './plugins/plugin-user';
import BCrypt from 'bcrypt';

const ROLE = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    NORMAL: 'normal'
};

const UserSchema = new Schema(
    {
        username: {
            type: String,
            maxlength: 255,
            required: true,
            unique: true
        },
        password: {
            type: String,
            maxlength: 30
        },
        name: {
            type: String,
            maxlength: 254
        },
        role: {
            type: String,
            enum: Object.values(ROLE),
            default: ROLE.NORMAL
        },
        phone: {
            type: String,
            maxlength: 15
        },
        email: {
            type: String,
            maxlength: 255
        },
        address: {
            type: String,
            maxlength: 255
        },
        countTest: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

UserSchema.statics = {
    ROLE
};
UserSchema.plugin(MongoosePaginate);
UserSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });
UserSchema.plugin(PluginUser);
UserSchema.methods.verifyPassword = function(password) {
    return BCrypt.compareSync(password, this.password);
};

export default Mongoose.model('User', UserSchema);
