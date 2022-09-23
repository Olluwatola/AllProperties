import mongoose, { Document, Schema } from 'mongoose';

export interface IReview {
    review: string;
    rating: number;
    createdAt: Date;
    //images: mongoose.Types.Array<string>;
    property: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
}

export interface IReviewModel extends IReview, Document {}

const reviewSchema: Schema = new Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty!'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        property: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Review must belong to a property'],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export default mongoose.model<IReviewModel>('Review', reviewSchema);
