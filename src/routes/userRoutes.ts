import express from 'express';
import { userControllerExports } from './../controllers/userController';

import { authControllerExports } from './../controllers/authController';

const router = express.Router();

router.post('/signup', userControllerExports.signUp);
router.post('/login', userControllerExports.login);

//protect all routes after this mmiddleware
router.use(authControllerExports.protect);

router.patch('/updateMyPassword', authControllerExports.updatePassword);
router.delete('/deleteMe', userControllerExports.deleteMe);
router.delete('/updateteMe', userControllerExports.updateMe);
router.get('/', userControllerExports.getAllUser);
router
    .route('/:id')
    .get(userControllerExports.getUser)
    .patch(userControllerExports.updateUser);

router.delete('/banUser/:id', userControllerExports.banUser);

export const userRoutesExports = {
    router: router,
};
