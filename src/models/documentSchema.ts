import mongoose, { Date, Document, Schema } from 'mongoose';

export interface IUserDocument {
    user: mongoose.Types.ObjectId;
    postedOn : Date;
    message: string;
}

export interface IUserDocumentModel extends IUserDocument, Document {}


// each document document should have  the property 
// of the property it belongs to 
// and if its for verification , it should carry the 
// id
// for profile picture it should carry user id

// it should ccarry the w3 buckt key 
// also the link(public link)
// i think these fields would be arrays , yunno for 
// posts that may have up to 10 pictures



const UserDocumentSchema: Schema = new Schema({
   user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'notification must have an end reciever'],
    },
    postedOn:{
        type:Date,
        default:Date.now()
    },
});


export default mongoose.model<IUserDocumentModel>('UserDocument', UserDocumentSchema);
