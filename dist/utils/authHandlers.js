"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHandlersExports = void 0;
//import mongoose from 'mongoose';
//import User, { IUser, IUserModel } from '../models/userSchema';
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const tokenRecover = (req, res, next) => {
    let token = null;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        console.log(req.headers.authorization);
        token = req.headers.authorization.split(' ')[1];
    }
    //  else if (req.cookies.jwt) {
    //     token = req.cookies.jwt;
    // }
    console.log(`this token should be null ${token}`);
    if (token != null) {
        req.token = token;
        console.log(`this token should NO LONGER be null ${token}`);
        next();
    }
    else if (token == null) {
        console.log(`this token should still be null ${token}`);
        res.status(401).send('You are not logged in! Please log in to get access.');
    }
};
const userIDRecover = (req, res, token) => {
    const JWT_SECRET = 'unhappy';
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    console.log(decoded);
    console.log('decodeded : ', decoded.id);
    return decoded.id;
};
const sendToken = (id, statusCode, req, res) => {
    const JWT_SECRET = 'unhappy'; // to be an envirnment variable
    const JWT_EXPIRES_IN = 30 * 24 * 60 * 60 * 1000; // to be an env variable
    let token = (0, jsonwebtoken_1.sign)({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    //remove password from output
    console.log(token);
    res.status(statusCode).json({
        status: 'success',
        token,
    });
};
exports.authHandlersExports = {
    tokenRecover,
    userIDRecover,
    sendToken
};
