import { Document, model, Model, Schema, Types } from "mongoose";

const VerificationSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    code: {
        type: String,
        min: 4,
        max: 4,
        default: '0000'
    },
    password: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

interface IVerificationSchema extends Document {
    timestamp: Date;
    code: string;
    password: string;
    sentAt: Date;
};

VerificationSchema.methods.setCode = function(this: IVerification) {
    const code = [0, 0, 0, 0];
    for (let i = 0; i < code.length; i++) {
        const randNum = Math.floor(Math.random() * (10 - 0) - 0);
        code[i] = randNum;
    }

    this.code = code.join('');
}

interface IVerificationBase extends IVerificationSchema {
    // methods and virtuals here
    setCode(this: IVerification): void;
};

export interface IVerification extends IVerificationBase {
    // refs here
    user: Types.ObjectId;
};

export interface IVerificationModel extends Model<IVerification> {
    // statics
};

export const VerificationModel = model<IVerification, IVerificationModel>('verification', VerificationSchema);