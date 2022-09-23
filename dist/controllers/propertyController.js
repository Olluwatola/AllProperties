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
exports.propertyControllerExports = void 0;
const propertySchema_1 = __importDefault(require("../models/propertySchema"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const stateSchema_1 = __importDefault(require("../models/stateSchema"));
const LGASchema_1 = __importDefault(require("../models/LGASchema"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const authHandlers_1 = require("../utils/authHandlers");
//const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb((new Error('Image uploaded is not of type jpg/jpeg  or png'), false));
    }
};
const upload = (0, multer_1.default)({
    //storage: multerStorage,
    fileFilter: multerFilter,
    dest: 'uploads/',
});
const uploadPropertyImages = upload.fields([{ name: 'images', maxCount: 10 }]);
const resizeAndUploadPropertyImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //if (!req.files.imageCover || !req.files.images) return next();
    if (req.verificationStatus != 'verified') {
        res.status(401).send('Please make sure you are verified');
    }
    // // 1) Cover image
    // req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    // await sharp(req.files.imageCover[0].buffer)
    //     .resize(2000, 1333)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toFile(`public/img/tours/${req.body.imageCover}`);
    // 2) Images
    else {
        if (!req.files) {
            return next();
        }
        req.body.images = [];
        req.body.links = [];
        yield Promise.all(req.files.images.map((file, i) => __awaiter(void 0, void 0, void 0, function* () {
            const filename = `prop-${req.params.id}-user-${req.user}-on-${Date.now()}-${i + 1}.jpeg`;
            yield (0, sharp_1.default)(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                //.toFile(`public/img/tours/${filename}`);
                .toFile(`uploads/${filename}`);
            req.body.images.push(filename);
            // figure out the links array
            // upload the file to w3
        })));
        next();
    }
});
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let lgaId;
    let stateId;
    // const token: string | void = authHandlersExports.tokenRecover(
    //     req,
    //     res,
    //     next
    // );
    //const JWT_SECRET: string = 'unhappy';
    let userID = req.id;
    // let decoded: JwtPayload ;
    // if (token != null) {
    //     decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    //     userID = decoded.id;
    //     return decoded
    // } else{
    //         res.status(401).send(`please make sure you are logged in`);
    //         next()
    // }
    //console.log('decodeded : ', decoded.id);
    console.log(req.body);
    yield userSchema_1.default.findById(userID)
        .then((rUser) => {
        if ((rUser === null || rUser === void 0 ? void 0 : rUser.verificationStatus) != 'verified' &&
            (rUser === null || rUser === void 0 ? void 0 : rUser.role) != 'Admin') {
            res.status(401).send(`you do not have the permission to do this, please make sure your profle is verified`);
            next();
        }
    })
        .catch((err) => {
        console.log(err);
    });
    //getting the state id
    yield stateSchema_1.default.findOne({ state: req.body.state })
        .then((state) => {
        if (state != null) {
            console.log(state);
            console.log(`state found ${state.state} ${state.id}`);
            stateId = state.id;
        }
    })
        .catch((err) => {
        console.log(err);
    });
    yield LGASchema_1.default.findOne({ name: req.body.lga })
        .then((lga) => {
        if (lga) {
            console.log(lga);
            console.log(`lga found ${lga.name},${lga.id}`);
            lgaId = lga.id;
        }
    })
        .catch((err) => {
        console.log(err);
    });
    console.log(lgaId);
    console.log(stateId);
    yield propertySchema_1.default.create({
        name: req.body.name,
        address: req.body.address,
        price: req.body.price,
        description: req.body.description,
        status: req.body.status,
        addedInfo: req.body.AddedInfo,
        plotSize: req.body.plotSize,
        capacity: req.body.capacity,
        listedBy: userID,
        propertyType: req.body.propertyType,
        state: req.body.state,
        LGA: req.body.LGA,
        stateID: stateId,
        LGAID: lgaId,
    })
        .then((property) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(property);
        res.status(201).send(`property listed ${property}`);
    }))
        .catch((err) => res.status(500).send(`an error occured ${err}`));
});
const getProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let doc = yield propertySchema_1.default.findById(req.params.id).populate('listedBy');
    // if (popOptions) query = query.populate(popOptions);
    //const doc = await query;
    if (!doc) {
        res.status(404).send('No property found with that ID');
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
const getAllProperties = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const doc = await Property.find().exec();
    //let filter = {};
    // if (req.params.propertyId) filter = { property: req.params.tourId };
    // const features = new ApiFeaturesExports.APIFeatures(Property.find(filter), req.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();
    // const doc = await features.query.explain();
    //const doc = await features.query;
    //const doc = await features
    let doc;
    console.log(req.query);
    //Build the query
    const queryObj = Object.assign({}, req.query);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => {
        delete queryObj[el];
    });
    //ADVANCED Filtering
    let queryStr = '';
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(queryString);
    let queryRes = propertySchema_1.default.find(JSON.parse(queryString));
    // 2) Sorting
    if (req.query.sort) {
        req.query.sort = req.query.sort;
        const sortBy = JSON.parse(req.query.sort.split(',').join(' '));
        queryRes = queryRes.sort(sortBy);
    }
    else {
        queryRes = queryRes.sort({ postedAt: 1 });
    }
    // LIMITING FIELD
    //queryRes = queryRes.select({ name: 1, price: 1 , status: 1, capacity:1 , LGA:1});
    //queryRes = queryRes.select();
    if (req.query.fields) {
        var s = req.query.fields;
        console.log(s);
        var fieldArray = s.split(',');
        console.log(fieldArray);
        var fieldStr = '{';
        fieldArray.forEach((x) => {
            // console.log(`${x} | ${fieldArray[fieldArray.length-1]}`)
            if (x == fieldArray[fieldArray.length - 1]) {
                fieldStr = fieldStr + '"' + x + '":1';
            }
            else {
                fieldStr = fieldStr + '"' + x + '":1,';
            }
        });
        fieldStr = fieldStr + '}';
        console.log(fieldStr);
        console.log(JSON.parse(fieldStr));
        queryRes = queryRes.select(JSON.parse(fieldStr));
    }
    //PAGINATE
    if (req.query.page || req.query.limit) {
        let page;
        let limit;
        page = Number(req.query.page) * 1 || 1;
        limit = Number(req.query.limit) * 1 || 10;
        let skip = (page - 1) * limit;
        queryRes = queryRes.skip(skip).limit(limit);
    }
    // EXECUTE QUERY
    doc = yield queryRes.exec();
    //SEND RESPONSE
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
exports.propertyControllerExports = {
    list,
    // login,
    getProperty,
    updateProperty,
    getAllProperties,
    deleteProperty,
    uploadPropertyImages,
    resizeAndUploadPropertyImages,
    // deleteMe,
    // updateMe,
};
