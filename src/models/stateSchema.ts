import mongoose,{ Document, Schema } from 'mongoose';

export interface IState {
    state: string;
    alias: string;
    lgas: Array<string>
}

export interface IStateModel extends IState, Document {}

const stateSchema: Schema = new Schema({
    state: {
        type: String,
        required: true,
    },
    alias: {
        type: String,
        select:false
    },
    lgas: {
        type: [String],
    },
});


export default mongoose.model<IStateModel>('State', stateSchema);