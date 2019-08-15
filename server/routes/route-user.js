'use strict';

import { ControllerUser } from '../controllers';
import { User } from '../models';
import { AuthMiddleware, RoleMiddleware } from '../middlwares';
import { celebrate } from 'celebrate';
import { 
    loginValidationSchema, 
    signUpSchema, 
    changePasswordSchema, 
    updateSchema 
} from '../validations/validation-user';
import {
    paginateValidationSchema,
    objectIdSchema
} from '../validations/validation-init';

const isAuth = AuthMiddleware.isAuth;
const isAdmin = RoleMiddleware.isValidRole(User.ROLE.ADMIN);
module.exports = (app, router) => {
    router
        .route('/login')
        .post(celebrate({ body: loginValidationSchema }), ControllerUser.login);

    router
        .route('/sign-up')
        .post(celebrate({ body: signUpSchema }),ControllerUser.create);

    router
        .route('/user')
        .get([isAuth],ControllerUser.getOne)
        .put([isAuth, celebrate({ body: updateSchema })],ControllerUser.update);

    router
        .route('/user/change-password')
        .put([isAuth, celebrate({ body: changePasswordSchema })], ControllerUser.changePassword);

    router
        .route('/user/:id')
        .delete([isAuth, isAdmin, celebrate({ params: objectIdSchema })], ControllerUser.delete);

    router
        .route('/admin/users')
        .get([isAuth, isAdmin, celebrate({ query: paginateValidationSchema })], ControllerUser.getAllByAdmin);

    router
        .route('/admin/become-teacher/:id')
        .put([isAuth, isAdmin, celebrate({ params: objectIdSchema })], ControllerUser.becomeTeacher);

};