import express, { Application, Request, Response, NextFunction } from 'express';
import { propertyControllerExports } from './../controllers/propertyController';
import { otherControllerExports } from './../controllers/otherController';
import { authControllerExports } from './../controllers/authController';


const router = express.Router();


router.get('/', propertyControllerExports.getAllProperties);

router.route('/:propertyId').get(propertyControllerExports.getProperty);


router.use(authControllerExports.protect);

router.get('/getstates', otherControllerExports.getStates);
router.get('/getlgas', otherControllerExports.getLGAs);

router
    .route('/')
    .post(
        propertyControllerExports.uploadPropertyImages,
        propertyControllerExports.resizeAndUploadPropertyImages,
        propertyControllerExports.list
    );
router.delete('/:id', propertyControllerExports.deleteProperty);
// router.delete('/deleteMe', propertyControllerExports.deleteMe);
// router.delete('/updateteMe', propertyControllerExports.updateMe);


router
    .route('/:id')
    .patch(
        propertyControllerExports.uploadPropertyImages,
        propertyControllerExports.updateProperty
    );

export const propertyRoutesExports = {
    router: router,
};
