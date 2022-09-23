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
const BookingSchema = new mongoose_1.Schema({
    property: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Property',
        required: [true, 'Booking must belong to a property'],
    },
    duration: {
        type: Number,
    },
    bookedOn: {
        type: Date,
        required: true,
        default: Date.now()
    },
    rentStart: {
        type: Date,
    },
    rentEnd: {
        type: Date,
    },
    checkInTime: {
        type: Date,
    },
    price: Number,
    listedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'input id of property lister'],
    },
    bookedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'input id of property lister'],
    },
    // reportsByLister: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Reports',
    // },
    // reportsByBooker: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Reports',
    // },
    status: {
        type: String,
        enum: ['active', 'closed', 'terminated', 'reported']
    }
});
exports.default = mongoose_1.default.model('Booking', BookingSchema);
