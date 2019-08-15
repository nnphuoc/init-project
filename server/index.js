'use strict';
import Express from 'express';
import BodyParser from 'body-parser';
import Cors from 'cors';
import FS from 'fs';
import Http from 'http';
import I18N from 'i18n';
import Helmet from 'helmet';
import Path from 'path';
import Compress from 'compression';
import MethodOverride from 'method-override';
import morgan from 'morgan';
import { Logger, Response } from './helpers';
import { errorHandle, notFoundHandle, logErrors } from './helpers/error';
import { port, db } from './config';
import { connect } from './models';

const app = Express();

I18N.configure({
    locales: ['en'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    autoReload: true,
    updateFiles: false
});

app.use(I18N.init)
    .use(Cors())
    .use(Compress())
    .use(MethodOverride())
    .use(BodyParser.json())
    .use(BodyParser.urlencoded({ extended: true }))
    .use(morgan('combined'))
    .use(
        Express.static(Path.resolve(__dirname, '..', 'public'), {
            maxAge: 31557600000
        })
    )
    .use(Helmet());

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', (req, res) => res.json({ message: 'Welcome to fabo API!' }));

global.__rootDir = __dirname.replace('/server', '');

const router = Express.Router();
const routePath = `${__dirname}/routes`;

FS.readdir(routePath, (e, fileNames) => {
    if (e) {
        Logger.error(new Error(e));
    } else {
        for (const fileName of fileNames) {
            require(`${routePath}/${fileName}`)(app, router);
        }
        app.use(router);
        app.use(notFoundHandle);
        app.use(logErrors);
        app.use(errorHandle);
        app.use((e, req, res, next) => {
            Logger.error(new Error(e));
            return Response.error(res, e);
        });
    }
});

connect(db).then(() => {
    console.log('Conection DB successful!');
    Http.createServer(app).listen(port, () => {
        console.log(`App listening on ${port}!`);
    });
    // InitController.initDefault();
});

module.exports = app;