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
exports.notificationExports = void 0;
const notificationSchema_1 = __importDefault(require("../models/notificationSchema"));
// you will change type of trigger so as to allow population of username
class notification {
    constructor(recipientID) {
        this.recipient = recipientID;
    }
    reviewSubmittedBy(trigger, propertyID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield notificationSchema_1.default.create({
                reciever: this.recipient,
                trigger: trigger,
                message: `${trigger} dropped a review on your property: ${propertyID}`,
                propertyTrigger: propertyID
            }).then(() => {
                console.log('notification created');
            });
            return 'the notification has  been successfully created';
        });
    }
}
exports.notificationExports = {
    notification,
    // updateMe,
};
