import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking {
    property: mongoose.Types.ObjectId;
    duration: Number;
    bookedOn: Date;
    price: Number;
    rentStart: Date;
    rentEnd: Date;
    CheckInTime: Date;
    listedBy: mongoose.Types.ObjectId;
    bookedBy: mongoose.Types.ObjectId;
    status: String;
}

export interface IBookingModel extends IBooking, Document {}

const BookingSchema: Schema = new Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: [true, 'Booking must belong to a property'],
    },
    duration: {
        type: Number,
    },
    bookedOn: {
        type: Date,
        required: true,
        default:Date.now()
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'input id of property lister'],
    },
    bookedBy: {
        type: Schema.Types.ObjectId,
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
    status:{
        type: String,
        enum: ['active','closed','terminated','reported']
    }
});

export default mongoose.model<IBookingModel>('Booking', BookingSchema);
