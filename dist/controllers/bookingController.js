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
exports.bookingControllerExports = void 0;
const propertySchema_1 = __importDefault(require("../models/propertySchema"));
const bookingSchema_1 = __importDefault(require("../models/bookingSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authHandlers_1 = require("../utils/authHandlers");
const createBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = authHandlers_1.authHandlersExports.tokenRecover(req, res, next);
    const JWT_SECRET = 'unhappy';
    let decoded = null;
    if (token != null) {
        decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    console.log(decoded);
    //console.log('decodeded : ', decoded.id);
    let listedBy;
    let propertyName;
    const propertyid = req.params.propertyid;
    yield propertySchema_1.default.findOne({ propertyid }).then((property) => {
        if (property != null) {
            console.log(property);
            listedBy = property.listedBy;
            propertyName = property.name;
        }
        else {
            res.status(400).send(` There is no property with id in our database`);
        }
    });
    console.log(`listed By ${listedBy}`);
    if (listedBy == (decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
        console.log(listedBy);
        console.log(decoded === null || decoded === void 0 ? void 0 : decoded.id);
        res.status(400).send(`listedBy ${listedBy}, bookedBy ${decoded === null || decoded === void 0 ? void 0 : decoded.id} you cannot book a property you listed`);
    }
    else {
        console.log(req.body);
        const newBooking = yield bookingSchema_1.default.create({
            property: propertyid,
            duration: req.body.address,
            bookedOn: req.body.bookedOn,
            rentStart: req.body.rentStart,
            rentEnd: req.body.rentEnd,
            price: req.body.price,
            CheckInTime: req.body.checkInTime,
            listedBy: listedBy,
            bookedBy: decoded === null || decoded === void 0 ? void 0 : decoded.id,
            status: req.body.status,
        })
            .then((booking) => __awaiter(void 0, void 0, void 0, function* () {
            res.status(201).send(`successfully booked ${propertyName}`);
        }))
            .catch((err) => res.status(500).send(`an error occured ${err}`));
    }
});
const getBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let doc = yield bookingSchema_1.default.findById(req.params.id);
    // if (popOptions) query = query.populate(popOptions);
    //const doc = await query;
    if (!doc) {
        res.status(404).send('No booking found with that ID');
    }
    else if (doc) {
        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    }
});
const getAllBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield bookingSchema_1.default.find().exec();
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc,
        },
    });
});
const updateProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let userID;
    let doc = null;
    let responseMessage = 'unsuccessful';
    const propertyID = req.params.id;
    const token = authHandlers_1.authHandlersExports.tokenRecover(req, res, next);
    if (token != null) {
        userID = authHandlers_1.authHandlersExports.userIDRecover(req, res, token);
    }
    let reqID;
    yield propertySchema_1.default.findById(propertyID)
        .populate('listedBy')
        .exec()
        .then((property) => __awaiter(void 0, void 0, void 0, function* () {
        if (property != null) {
            reqID = property.listedBy.id;
        }
        if (!property) {
            responseMessage = 'no document of that id found';
        }
        if (userID == reqID) {
            doc = yield propertySchema_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });
            responseMessage = 'property successfully deleted';
        }
        else {
            responseMessage = 'you do not have the permission to do that';
        }
    }));
    if (!doc) {
        res.status(404).send('No property found with that ID');
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
            responseMessage,
        },
    });
});
const deleteProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let userID;
    const propertyID = req.params.id;
    const token = authHandlers_1.authHandlersExports.tokenRecover(req, res, next);
    if (token != null) {
        userID = authHandlers_1.authHandlersExports.userIDRecover(req, res, token);
    }
    let responseMessage = 'unsuccessful';
    let reqID;
    yield propertySchema_1.default.findById(propertyID)
        .populate('listedBy')
        .exec()
        .then((property) => __awaiter(void 0, void 0, void 0, function* () {
        if (property != null) {
            reqID = property.listedBy.id;
        }
        if (!property) {
            responseMessage = 'no document of that id found';
        }
        if (userID == reqID) {
            yield propertySchema_1.default.findByIdAndDelete(propertyID).exec();
            responseMessage = 'property successfully deleted';
        }
        else {
            responseMessage = 'you do not have the permission to do that';
        }
    }));
    res.status(200).json({
        status: 'success',
        data: {
            data: responseMessage,
        },
    });
});
// // const signToken = (id) => {
// //     return jwt.sign({ id }, process.env.JWT_SECRET, {
// //         expiresIn: process.env.JWT_EXPIRES_IN,
// //     });
// // };
// const signToken = (id: string) => {
//     const JWT_SECRET: string = 'unhappy'; // to be an envirnment variable
//     const JWT_EXPIRES_IN: number = 30 * 24 * 60 * 60 * 1000; // to be an env variable
//     return sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
// };
// const sendToken = (
//     id: string,
//     statusCode: number,
//     req: Request,
//     res: Response
// ) => {
//     const token = signToken(id);
//     //remove password from output
//     console.log(token);
//     // res.status(statusCode).json({
//     //     status: 'success',
//     // });
// };
// // const createSendToken = (user, statusCode, req, res) => {
// //     const token = signToken(user._id);
// //     res.cookie('jwt', token, {
// //         expires: new Date(
// //             Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
// //         ),
// //         httpOnly: true,
// //         secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
// //     });
// //     // Remove password from output
// //     user.password = undefined;
// //     res.status(statusCode).json({
// //         status: 'success',
// //         token,
// //         data: {
// //             user,
// //         },
// //     });
// // };
// const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
//     // to do this you need to have access to the user id, which would be custom
//     //signed into the jwt token, meaning we'll have to add the user id to the
//     //token id because jwt doesnt do that automatically
//     //so we will use the user id to query the db on the user to SUSPEND from the data base.
//     const token: string | void = authHandlersExports.tokenRecover(
//         req,
//         res,
//         next
//     );
//     const JWT_SECRET: string = 'unhappy';
//     //const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//     //const decoded = await promisify();
//     const decoded = jwt.verify(token, JWT_SECRET);
//     console.log(decoded);
//     //const decodeded = JSON.stringify(decoded)
//     console.log('decodeded : ', decoded.id);
//     const doc = await User.findByIdAndDelete(decoded.id);
//     if (!doc) {
//         return console.log('No document found with that ID');
//     }
//     res.send('user deletted');
// };
// const updateMe = async (req: Request, res: Response, next: NextFunction) => {
//     // to do this you need to have access to the user id, which would be custom
//     //signed into the jwt token, meaning we'll have to add the user id to the
//     //token id because jwt doesnt do that automatically
//     //so we will use the user id to query the db on the user to updateMe from the data base.
// };
// const login = async (req: Request, res: Response, next: NextFunction) => {
//     const email: string = req.body.email;
//     const password: string = req.body.password;
//     // 1) Check if email and password exist
//     if (!email || !password) {
//         res.send('please provide email and password');
//     }
//     // 2) Check if user exists && password is correct
//     const foundUser = await User.findOne({ email }).select('+password').exec();
//     sendToken(foundUser?.id, 200, req, res);
//     // if (!user || !(await user.correctPassword(password, user.password))) {
//     //     res.send('please input correct password');
//     // }
// };
exports.bookingControllerExports = {
    createBooking,
    // login,
    getAllBooking,
    // updateBooking,
    getBooking,
    // terminateBooking,
    // deleteMe,
    // updateMe,
};
