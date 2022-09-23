import mongoose, { Document, Schema } from 'mongoose';

export interface ILGA {
    name: string;
}

export interface ILGAModel extends ILGA, Document {}

const LGASchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

export default mongoose.model<ILGAModel>('LGA', LGASchema);
