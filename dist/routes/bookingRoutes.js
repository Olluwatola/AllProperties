"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutesExports = void 0;
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const router = express_1.default.Router();
router.post('/:propertyid', bookingController_1.bookingControllerExports.createBooking);
// router.post('/login', bookingControllerExports.login);
// router.delete('/banUser/:id', bookingControllerExports.banUser);
// router.delete('/deleteMe', bookingControllerExports.deleteMe);
// router.delete('/updateteMe', bookingControllerExports.updateMe);
//getAllBookings should be available to only admins
router.get('/', bookingController_1.bookingControllerExports.getAllBooking);
router
    .route('/:id')
    .get(bookingController_1.bookingControllerExports.getBooking);
//     .patch(bookingControllerExports.updateUser);
exports.bookingRoutesExports = {
    router: router,
};
