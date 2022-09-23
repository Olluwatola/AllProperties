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
exports.userControllerExports = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const authHandlers_1 = require("../utils/authHandlers");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const newUser = yield userSchema_1.default.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        verificationStatus: req.body.verificationStatus,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        const foundUser = yield userSchema_1.default.findById(user.id);
        console.log('user found', foundUser);
        sendToken(foundUser === null || foundUser === void 0 ? void 0 : foundUser.id, 200, req, res);
        console.log('token sent');
        //res.status(201).send(`user created ${user}`);
    }));
    //.catch(() => res.status(500).send('an error occured'));
});
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let doc = yield userSchema_1.default.findById(req.params.id);
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
});
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield userSchema_1.default.find().exec();
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc,
        },
    });
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield userSchema_1.default.findByIdAndUpdate(req.params.id, req.body, {
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
});
const banUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const temp = yield userSchema_1.default.findByIdAndDelete(userId).exec();
    console.log(temp);
    const responseMessage = 'user successfully deleted';
    res.status(200).json({
        status: 'success',
        data: {
            data: responseMessage,
        },
    });
});
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };
const signToken = (id) => {
    const JWT_SECRET = 'unhappy'; // to be an envirnment variable
    const JWT_EXPIRES_IN = 30 * 24 * 60 * 60 * 1000; // to be an env variable
    return (0, jsonwebtoken_1.sign)({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
const sendToken = (id, statusCode, req, res) => {
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
const deleteMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // to do this you need to have access to the user id, which would be custom
    //signed into the jwt token, meaning we'll have to add the user id to the
    //token id because jwt doesnt do that automatically
    //so we will use the user id to query the db on the user to SUSPEND from the data base.
    const token = authHandlers_1.authHandlersExports.tokenRecover(req, res, next);
    const JWT_SECRET = 'unhappy';
    //const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    let decoded;
    let userID = '';
    if (token != null) {
        decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        userID = decoded.id;
    }
    //const decodeded = JSON.stringify(decoded)
    console.log('decodes id : ', userID);
    const doc = yield userSchema_1.default.findByIdAndDelete(userID);
    if (!doc) {
        return console.log('No document found with that ID');
    }
    res.send('user deletted');
});
const updateMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // to do this you need to have access to the user id, which would be custom
    //signed into the jwt token, meaning we'll have to add the user id to the
    //token id because jwt doesnt do that automatically
    //so we will use the user id to query the db on the user to updateMe from the data base.
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    // 1) Check if email and password exist
    if (!email || !password) {
        res.send('please provide email and password');
        next();
    }
    // 2) Check if user exists && password is correct
    const foundUser = yield userSchema_1.default.findOne({ email }).select('+password').exec();
    if (!foundUser || !(yield foundUser.correctPassword(password, foundUser.password))) {
        res.status(401).send('Incorrect email or password');
    }
    else {
        sendToken(foundUser === null || foundUser === void 0 ? void 0 : foundUser.id, 200, req, res);
    }
});
exports.userControllerExports = {
    signUp,
    login,
    getUser,
    updateUser,
    getAllUser,
    banUser,
    deleteMe,
    updateMe,
};
