import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty {
    name: string;
    address: string;
    price: number;
    description: string;
    status: string;
    postedAt: Date;
    images: mongoose.Types.Array<string>; 
    //might eventually be just an array of links
    listedBy: mongoose.Types.ObjectId;
    addedInfo: string;
    ratingsAverage: number;
    propertyType: string;
    plotSize: number;
    state: string;
    LGA: string;
    stateID: mongoose.Types.ObjectId;
    LGAID: mongoose.Types.ObjectId;
    capacity: number;
    verified: boolean;
}

export interface IPropertyModel extends IProperty, Document {}

const propertySchema: Schema = new Schema({
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
        type: Schema.Types.ObjectId,
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
    images: [String],// fix it
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
        set: (val: number) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
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
        type: String,
    },
    LGA: {
        type: String,
    },
    stateID: {
        type: Schema.Types.ObjectId,
        ref: 'State',
    },
    LGAID: {
        type: Schema.Types.ObjectId,
        ref: 'LGA'
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

export default mongoose.model<IPropertyModel>('Property', propertySchema);
