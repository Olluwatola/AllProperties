import mongoose, { Date, Document, Schema } from 'mongoose';

export interface INotification {
    reciever: [mongoose.Types.ObjectId];
    type: string;
    message: string;
    date: Date;
    deleted: boolean
    readStatus: boolean;
    trigger: mongoose.Types.ObjectId;
    propertyTrigger: mongoose.Types.ObjectId;
}

export interface INotificationModel extends INotification, Document {}

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

const NotificationSchema: Schema = new Schema({
    reciever: [{
        type: Schema.Types.ObjectId,
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
    deleted:{
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
        type: Schema.Types.ObjectId,
        ref: 'Property',
    },
    trigger: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default mongoose.model<INotificationModel>('Notification', NotificationSchema);
