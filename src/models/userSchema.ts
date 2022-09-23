import { number, string } from 'joi';
import mongoose, { Document, Schema } from 'mongoose';


import bcrypt from 'bcryptjs';

export interface IUser {
    
    name: string;
    email: string;
    phone: string;
    verificationStatus: string;
    role:string;
    password: string;
    passwordConfirm: string;
    correctPassword(
        candidatePassword: string,
        userPassword: string
    ): Promise<boolean>;

    
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
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

UserSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    console.log(this.password);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

UserSchema.methods.correctPassword = function (
    candidatePassword: string,
    userPassword: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, userPassword, (err, success) => {
            if (err) return reject(err);
            return resolve(success);
        });
    });
};

export default mongoose.model<IUserModel>('User', UserSchema);
