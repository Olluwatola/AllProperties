"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllerExports = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authHandlers_1 = require("../utils/authHandlers");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.jwt) {
    //     token = req.cookies.jwt;
    // }
    //recover user id from verification/bearer token
    //JWT_SECRET SHOULD BE IN THE ENV FILE
    let JWT_SECRET = 'unhappy';
    let decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    //check if user still exists
    const currentUser = yield userSchema_1.default.findById(decoded.id).exec();
    if (!currentUser) {
        return next(res
            .status(401)
            .send('The user who this token belongs to no longer exist'));
    }
    else {
        req.id = decoded.id.trim();
        req.verificationStatus = currentUser.verificationStatus;
        console.log(`this is req.id ${req.id}`);
        next();
    }
});
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // authHandlersExports.tokenRecover(req, res, next);
    let userID = req.id;
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
    const foundUser = yield userSchema_1.default.findOne({ _id: userID.trim() }).select('+password');
    console.log(`this is the user object ${foundUser}`);
    if (!foundUser) {
        res.status(401).send('can not find foundUser');
        next();
    }
    else {
        // 2) Check if POSTed current password is correct
        if (!(yield (foundUser === null || foundUser === void 0 ? void 0 : foundUser.correctPassword(req.body.passwordCurrent, foundUser.password)))) {
            res.status(401).send('the CURRENT PASSWORD you inputted is wrong');
            next();
        }
        // 3) If so, update password
        foundUser.password = req.body.password;
        foundUser.passwordConfirm = req.body.passwordConfirm;
        yield foundUser.save();
        // User.findByIdAndUpdate will NOT work as intended!
        // 4) Log user in, send JWT
        authHandlers_1.authHandlersExports.sendToken(foundUser === null || foundUser === void 0 ? void 0 : foundUser.id, 200, req, res);
    }
});
exports.authControllerExports = {
    updatePassword,
    protect,
    //getLGAs,
};
