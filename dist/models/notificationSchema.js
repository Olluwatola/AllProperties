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
//notifcation type could eventually be a table of 
//its own, most likely
// entity id 
// we will have different entity id fields
//  depends on lalades response but i expect that we 
// will have entity id fields for user, property
// and possibly booking
// i dont think we will have for documents tho'
// we can have for when verification Schema Status has been 
// updated
//like  when verification document reviewed
// verification document rejected
// verification document accepted
// i think trigger can only have one id or trigger, 
// either a user or property
//i think we should trigger to be only users
// users can trigger a notification through rating a 
//property 
// FOR NOTIFICATION , I WOULD SUGGEST YOUN USE A 
// CLASS WITH DIFFERENT METHODSS TO CREATE DIFFERENT 
// METHODS FOR  DIFFERENT TYPES OF NOTIFICATIONS
const NotificationSchema = new mongoose_1.Schema({
    reciever: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'notification must have an end reciever'],
        }],
    type: {
    // type: String,
    // enum: ['verification', 'document', 'featuredPost','general','review','property'],
    // A TYPE SCHEMA OBJECT OF DIFFERENT 
    //NOTIFICATION  TYPES OR THIS COULD BE 
    //REPLACED BY A CLASS
    },
    deleted: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
    },
    time: {
        type: Date,
        default: Date.now(),
    },
    readStatus: {
        type: Boolean,
        default: false,
    },
    propertyTrigger: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Property',
    },
    trigger: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
});
exports.default = mongoose_1.default.model('Notification', NotificationSchema);
