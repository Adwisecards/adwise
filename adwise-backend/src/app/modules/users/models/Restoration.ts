import { Document, model, Model, Schema, Types } from "mongoose";

const RestorationSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    code: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

interface IRestorationSchema extends Document {
    code: string;
    timestamp: Date;
    confirmed: boolean;
    sentAt: Date;
};

RestorationSchema.methods.setCode = function(this: IRestoration) {
    const code = [0, 0, 0, 0];
    for (let i = 0; i < code.length; i++) {
        const randNum = Math.floor(Math.random() * (10 - 0) - 0);
        code[i] = randNum;
    }

    this.code = code.join('');
}

interface IRestorationBase extends IRestorationSchema {
    setCode(this: IRestoration): void
};

export interface IRestoration extends IRestorationBase {
    user: Types.ObjectId;
};

export interface IRestorationModel extends Model<IRestoration> {};

export const RestorationModel = model<IRestoration, IRestorationModel>('restoration', RestorationSchema);