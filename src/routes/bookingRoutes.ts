import express, { Application, Request, Response, NextFunction } from 'express';
import { bookingControllerExports } from '../controllers/bookingController';

const router = express.Router();

router.post('/:propertyid', bookingControllerExports.createBooking);
// router.post('/login', bookingControllerExports.login);
// router.delete('/banUser/:id', bookingControllerExports.banUser);
// router.delete('/deleteMe', bookingControllerExports.deleteMe);
// router.delete('/updateteMe', bookingControllerExports.updateMe);

//getAllBookings should be available to only admins
router.get('/', bookingControllerExports.getAllBooking);

 router
     .route('/:id')
     .get(bookingControllerExports.getBooking)
//     .patch(bookingControllerExports.updateUser);

export const bookingRoutesExports = {
    router: router,
};
