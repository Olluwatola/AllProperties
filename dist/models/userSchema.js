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
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    verificationStatus: {
        type: String,
        required: true,
        enum: ['unverified', 'verified'],
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        // validate: {
        // // This only works on CREATE and SAVE!!!
        // validator: function(el:string) {
        //     return el === this.password;
        // },
        // message: 'Passwords are not the same!'
        // }
    },
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only run this function if password was actually modified
        if (!this.isModified('password'))
            return next();
        // Hash the password with cost of 12
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        console.log(this.password);
        // Delete passwordConfirm field
        this.passwordConfirm = undefined;
        next();
    });
});
UserSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return new Promise((resolve, reject) => {
        bcryptjs_1.default.compare(candidatePassword, userPassword, (err, success) => {
            if (err)
                return reject(err);
            return resolve(success);
        });
    });
};
exports.default = mongoose_1.default.model('User', UserSchema);
