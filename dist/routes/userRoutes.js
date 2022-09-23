"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutesExports = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("./../controllers/userController");
const authController_1 = require("./../controllers/authController");
const router = express_1.default.Router();
router.post('/signup', userController_1.userControllerExports.signUp);
router.post('/login', userController_1.userControllerExports.login);
//protect all routes after this mmiddleware
router.use(authController_1.authControllerExports.protect);
router.patch('/updateMyPassword', authController_1.authControllerExports.updatePassword);
router.delete('/deleteMe', userController_1.userControllerExports.deleteMe);
router.delete('/updateteMe', userController_1.userControllerExports.updateMe);
router.get('/', userController_1.userControllerExports.getAllUser);
router
    .route('/:id')
    .get(userController_1.userControllerExports.getUser)
    .patch(userController_1.userControllerExports.updateUser);
router.delete('/banUser/:id', userController_1.userControllerExports.banUser);
exports.userRoutesExports = {
    router: router,
};
