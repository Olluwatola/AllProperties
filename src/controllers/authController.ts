import express, { NextFunction, Request, Response } from 'express';
import User, { IUser, IUserModel } from '../models/userSchema';
import mongoose from 'mongoose';
import LGA from '../models/LGASchema';
import jwt, { JwtPayload, sign } from 'jsonwebtoken';
import { authHandlersExports } from '../utils/authHandlers';

const protect = async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token: string | undefined;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.jwt) {
    //     token = req.cookies.jwt;
    // }

    //recover user id from verification/bearer token

    //JWT_SECRET SHOULD BE IN THE ENV FILE
    let JWT_SECRET = 'unhappy';

    let decoded = jwt.verify(token as string, JWT_SECRET) as JwtPayload;

    //check if user still exists
    const currentUser = await User.findById(decoded.id).exec();

    if (!currentUser) {
        return next(
            res
                .status(401)
                .send('The user who this token belongs to no longer exist')
        );
    } else {
        req.id = decoded.id.trim();
        req.verificationStatus = currentUser.verificationStatus;
        console.log(`this is req.id ${req.id}`);
        next();
    }
};

const updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // authHandlersExports.tokenRecover(req, res, next);

    let userID: string = req.id as string;
    // const JWT_SECRET: string = 'unhappy';

    // let userID: string = '';

    // console.log(token);
    // let decoded: JwtPayload;
    // if (token != null) {
    //     decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    //     userID = decoded.id;
    //     console.log(decoded);
    // } else {
    //     res.status(401).send(`please make sure you are logged in`);
    //     next();
    // }
    // console.log('about to check for user');
    // console.log(userID);
    // // 1) Get user from collection
    // //let userObjID = new mongoose.Types.ObjectId(userID.trim())
    // console.log(userID);
    const foundUser = await User.findOne({ _id: userID.trim() }).select(
        '+password'
    );

    console.log(`this is the user object ${foundUser}`);
    if (!foundUser) {
        res.status(401).send('can not find foundUser');
        next();
    } else {
        // 2) Check if POSTed current password is correct
        if (
            !(await foundUser?.correctPassword(
                req.body.passwordCurrent,
                foundUser.password
            ))
        ) {
            res.status(401).send('the CURRENT PASSWORD you inputted is wrong');
            next();
        }

        // 3) If so, update password
        foundUser.password = req.body.password;
        foundUser.passwordConfirm = req.body.passwordConfirm;
        await foundUser.save();
        // User.findByIdAndUpdate will NOT work as intended!

        // 4) Log user in, send JWT
        authHandlersExports.sendToken(foundUser?.id, 200, req, res);
    }
};

export const authControllerExports = {
    updatePassword,
    protect,
    //getLGAs,
};
