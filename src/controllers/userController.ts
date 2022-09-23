import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User, { IUser, IUserModel } from '../models/userSchema';
import jwt, { JwtPayload, sign } from 'jsonwebtoken';
import { authHandlersExports } from '../utils/authHandlers';
import { promisify } from 'util';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        verificationStatus: req.body.verificationStatus,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
    }).then(async (user) => {
        const foundUser = await User.findById(user.id);
        console.log('user found', foundUser);
        sendToken(foundUser?.id, 200, req, res);
        console.log('token sent');
        //res.status(201).send(`user created ${user}`);
    });
    //.catch(() => res.status(500).send('an error occured'));
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    let doc = await User.findById(req.params.id);
    // if (popOptions) query = query.populate(popOptions);
    //const doc = await query;

    if (!doc) {
        res.status(404).send('No user found with that ID');
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
};

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    const doc = await User.find().exec();

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc,
        },
    });
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!doc) {
        res.status(404).send('No user found with that ID');
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
};

const banUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.id;

    const temp = await User.findByIdAndDelete(userId).exec();
    console.log(temp);
    const responseMessage: string = 'user successfully deleted';

    res.status(200).json({
        status: 'success',
        data: {
            data: responseMessage,
        },
    });
};

// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

const signToken = (id: string) => {
    const JWT_SECRET: string = process.env.JWT_SECRET as string; // to be an envirnment variable
    const JWT_EXPIRES_IN: number = Number(process.env.JWT_EXPIRES_IN); // to be an env
    return sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};;

const sendToken = (
    id: string,
    statusCode: number,
    req: Request,
    res: Response
) => {
    const token = signToken(id);
    //remove password from output

    console.log(token);

    res.status(statusCode).json({
        status: 'success',
        token,
    });
};

// const createSendToken = (user, statusCode, req, res) => {
//     const token = signToken(user._id);

//     res.cookie('jwt', token, {
//         expires: new Date(
//             Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//         ),
//         httpOnly: true,
//         secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
//     });

//     // Remove password from output
//     user.password = undefined;

//     res.status(statusCode).json({
//         status: 'success',
//         token,
//         data: {
//             user,
//         },
//     });
// };

const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
    // to do this you need to have access to the user id, which would be custom
    //signed into the jwt token, meaning we'll have to add the user id to the
    //token id because jwt doesnt do that automatically
    //so we will use the user id to query the db on the user to SUSPEND from the data base.

    const token: string | void = authHandlersExports.tokenRecover(
        req,
        res,
        next
    );

    const JWT_SECRET: string = 'unhappy';

    //const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    let decoded: JwtPayload;
    let userID: string = '';
    if (token != null) {
        decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        userID = decoded.id;
    }

    //const decodeded = JSON.stringify(decoded)
    console.log('decodes id : ', userID);
    const doc = await User.findByIdAndDelete(userID);

    if (!doc) {
        return console.log('No document found with that ID');
    }
    res.send('user deletted');
};

const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    // to do this you need to have access to the user id, which would be custom
    //signed into the jwt token, meaning we'll have to add the user id to the
    //token id because jwt doesnt do that automatically
    //so we will use the user id to query the db on the user to updateMe from the data base.
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    // 1) Check if email and password exist
    if (!email || !password) {
        res.send('please provide email and password');
        next();
    }
    // 2) Check if user exists && password is correct
    const foundUser = await User.findOne({ email }).select('+password').exec();

    if (!foundUser || !(await foundUser.correctPassword(password, foundUser.password))) {
        res.status(401).send('Incorrect email or password');
    }else{
        sendToken(foundUser?.id, 200, req, res);
    }
};

export const userControllerExports = {
    signUp,
    login,
    getUser,
    updateUser,
    getAllUser,
    banUser,
    deleteMe,
    updateMe,
};
