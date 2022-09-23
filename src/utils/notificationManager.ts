import mongoose, { Document, Schema } from 'mongoose';

import User, { IUser, IUserModel } from '../models/userSchema';

import Notification from '../models/notificationSchema';



// you will change type of trigger so as to allow population of username

class notification {
    recipient: string;

    constructor(recipientID: string) {
        this.recipient = recipientID;
    }

    async reviewSubmittedBy(trigger:string,propertyID: string): Promise<string> {
        await Notification.create({
            reciever:this.recipient,
            trigger: trigger,
            message:`${trigger} dropped a review on your property: ${propertyID}`,
            propertyTrigger:propertyID
            
        }).then(()=>{
            console.log('notification created')
        })


        return 'the notification has  been successfully created';
    }
}

export const notificationExports = {
    notification,
    // updateMe,
};