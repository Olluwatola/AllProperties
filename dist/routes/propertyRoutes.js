"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyRoutesExports = void 0;
const express_1 = __importDefault(require("express"));
const propertyController_1 = require("./../controllers/propertyController");
const otherController_1 = require("./../controllers/otherController");
const authController_1 = require("./../controllers/authController");
const router = express_1.default.Router();
router.get('/', propertyController_1.propertyControllerExports.getAllProperties);
router.route('/:propertyId').get(propertyController_1.propertyControllerExports.getProperty);
router.use(authController_1.authControllerExports.protect);
router.get('/getstates', otherController_1.otherControllerExports.getStates);
router.get('/getlgas', otherController_1.otherControllerExports.getLGAs);
router
    .route('/')
    .post(propertyController_1.propertyControllerExports.uploadPropertyImages, propertyController_1.propertyControllerExports.resizeAndUploadPropertyImages, propertyController_1.propertyControllerExports.list);
router.delete('/:id', propertyController_1.propertyControllerExports.deleteProperty);
// router.delete('/deleteMe', propertyControllerExports.deleteMe);
// router.delete('/updateteMe', propertyControllerExports.updateMe);
router
    .route('/:id')
    .patch(propertyController_1.propertyControllerExports.uploadPropertyImages, propertyController_1.propertyControllerExports.updateProperty);
exports.propertyRoutesExports = {
    router: router,
};
