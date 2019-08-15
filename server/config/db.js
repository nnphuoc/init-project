'use strict';
import dotEnv from 'dotenv';
dotEnv.config();

const db = {
    development: {
        URI: process.env.DATABASE_URI,
        USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
        PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD,
        IS_DEBUG: true,
        AUTH_DB: process.env.MONGO_AUTH_DB
    },
    test: {
        URI: '',
        IS_DEBUG: true
    },
    staging: {},
    production: {
        URI: process.env.DATABASE_URI,
        USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
        PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD,
        IS_DEBUG: true,
        AUTH_DB: process.env.MONGO_AUTH_DB
    }
};
module.exports = db;


