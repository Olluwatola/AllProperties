import mongoose from 'mongoose';
import dotenv from 'dotenv';

import {config} from './config/config';

import {appObj} from './app';

dotenv.config()

console.log(process.env.SERVER_PORT);



mongoose
    .connect('mongodb://127.0.0.1:27017/MagneeDB')
    .then(()=>{
        console.log(`mongoose connected on port ${config.server.port}`);
    })
    .catch((error:unknown)=>{
        console.log(`An error has occured in the Database connection , details below ${error}`)
    });

const server = appObj.app.listen(config.server.port, () => {
    console.log(`App running on port ${config.server.port}`);
});

