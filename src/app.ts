import path from 'path';
import express, {Application, Request, Response, NextFunction} from 'express';
import {userRoutesExports} from './routes/userRoutes';

import { propertyRoutesExports } from './routes/propertyRoutes';

import { bookingRoutesExports } from './routes/bookingRoutes';

const app: Application =express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use('/api/v1/users', userRoutesExports.router);
app.use('/api/v1/properties', propertyRoutesExports.router);
app.use('/api/v1/bookings', bookingRoutesExports.router);


export const appObj = {
    app: app,
}