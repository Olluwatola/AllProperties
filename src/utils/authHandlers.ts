import express, { NextFunction, Request, Response } from 'express';
//import mongoose from 'mongoose';
//import User, { IUser, IUserModel } from '../models/userSchema';
import jwt,{ JwtPayload, sign } from 'jsonwebtoken';

const tokenRecover = (req: Request, res: Response, next: NextFunction) => {
    let token = null;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        console.log(req.headers.authorization);
        token = req.headers.authorization.split(' ')[1];
    }
    //  else if (req.cookies.jwt) {
    //     token = req.cookies.jwt;
    // }
    console.log(`this token should be null ${token}`)
    if (token!=null) {
        
        req.token = token;
        console.log(`this token should NO LONGER be null ${token}`);
        next(); 
    }else if(token==null){
        console.log(`this token should still be null ${token}`);
        res.status(401).send(
            'You are not logged in! Please log in to get access.'
        );
    }
    

    
};

const userIDRecover = (req: Request, res: Response, token:string ) => {

    const JWT_SECRET: string = 'unhappy';
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    console.log(decoded);
    console.log('decodeded : ', decoded.id);

    return decoded.id
};

const sendToken = (
    id: string,
    statusCode: number,
    req: Request,
    res: Response
) => {

    const JWT_SECRET: string = process.env.JWT_SECRET as string; // to be an envirnment variable
    const JWT_EXPIRES_IN: number = Number(process.env.JWT_EXPIRES_IN); // to be an env variable
    let token = sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    
    //remove password from output

    console.log(token);

    res.status(statusCode).json({
        status: 'success',
        token,
    });
};

export const authHandlersExports = {
    tokenRecover,
    userIDRecover,
    sendToken
};
