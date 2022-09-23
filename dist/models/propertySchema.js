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
const mongoose_1 = __importStar(require("mongoose"));
const propertySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    listedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Property must be listed  by a user'],
    },
    status: {
        type: String,
        enum: [
            'available',
            'flagged',
            'occupied',
            'not available',
            'under maintenance',
        ],
        default: 'available',
    },
    images: [String],
    postedAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    addedInfo: String,
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    propertyType: {
        type: String,
        enum: ['Land-Lease', 'Event-Centres'],
        required: true,
    },
    plotSize: {
        type: Number,
    },
    state: {
        type: String
    },
    LGA: {
        type: String
    },
    stateID: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    LGAID: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    capacity: {
        type: Number,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    featuredPost: {
        type: Boolean,
        default: false,
    },
    waterAvalable: {
        type: Boolean,
        default: false,
    },
    parkingSpace: {
        type: Boolean,
        default: false,
    },
    tables: {
        type: Boolean,
        default: false,
    },
    AVCapabilities: {
        type: Boolean,
        default: false,
    },
});
// UserSchema.pre('save', async function (next) {
//     // Only run this function if password was actually modified
//     if (!this.isModified('password')) return next();
//     // Hash the password with cost of 12
//     this.password = await bcrypt.hash(this.password, 12);
//     console.log(this.password);
//     // Delete passwordConfirm field
//     this.passwordConfirm = undefined;
//     next();
// });
// UserSchema.methods.correctPassword = function (
//     candidatePassword: string,
//     userPassword: string
// ): Promise<boolean> {
//     return new Promise((resolve, reject) => {
//         bcrypt.compare(candidatePassword, userPassword, (err, success) => {
//             if (err) return reject(err);
//             return resolve(success);
//         });
//     });
// };
exports.default = mongoose_1.default.model('Property', propertySchema);
