import { Document, model, Model, Schema, Types } from "mongoose";
import { configProps } from "../../../services/config";

export const RefSchema = new Schema({
    mode: {
        type: String,
        default: 'contact'
    },
    type: {
        type: String,
        default: 'personal'
    },
    ref: {
        type: Types.ObjectId
    },
    code: {
        type: String,
        required: true
    },
    QRCode: {
        type: String,
        required: true
    },
    QRCode2: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

RefSchema.methods.setCode = function(this: IRef, lastCode: string = '00000000') {
    const arr = lastCode.split('');
    let r = 1;
    for (let i = lastCode.length-1; i >= 0; i--) {
        const sum = parseInt(lastCode[i]) + r;
        if (sum > 9) {
            arr[i] = Math.floor((0)).toString();
            arr[i-1] = Math.floor(sum % 10).toString();
        } else {
            arr[i] = Math.floor(sum).toString();
        }

        r = Math.floor(sum / 10);
    }

    this.code = arr.join('');
};

RefSchema.methods.setQRCode = function(this: IRef) {
    this.QRCode = `${configProps.backendUrl}/proxy/qr-code?size=256x256&data={"mode": "${this.mode}", "type": "${this.type}", "ref": "${this.ref}"}`;
    this.QRCode2 = `${configProps.backendUrl}/proxy/qr-code?size=256x256&color=8152E4&margin=0&qzone=1&data=${configProps.frontendUrl}/ref/${this.code}`;
};

interface IRefSchema extends Document {
    mode: string;
    type: string;
    code: string;
    QRCode: string;
    QRCode2: string;
    timestamp: Date;
};

interface IRefBase extends IRefSchema {
    setCode(this: IRef, lastCode: string): void;
    setQRCode(this: IRef): void;
};

export interface IRef extends IRefBase {
    ref: Types.ObjectId;
};

export interface IRefModel extends Model<IRef> {

};

export const RefModel = model<IRef, IRefModel>('ref', RefSchema);