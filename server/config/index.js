import FS from 'fs';
import dotEnv from 'dotenv';
import Path from 'path';
import DB from './db';
import Constants from './constants';
import Roles from './roles';

dotEnv.config();

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || '5002';

module.exports = {
    env,
    port,
    jwtCredentials: {
        publicKey: FS.readFileSync(
            Path.resolve(
                __dirname,
                '..',
                'config',
                'cert',
                `${env}.public.key`
            ),
            'utf8'
        ),
        privateKey: FS.readFileSync(
            Path.resolve(
                __dirname,
                '..',
                'config',
                'cert',
                `${env}.private.key`
            ),
            'utf8'
        )
    },
    db: DB[env],
    constants: Constants[env],
    roles: Roles
};
