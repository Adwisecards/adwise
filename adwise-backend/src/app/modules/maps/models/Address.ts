import { Document, model, Model, Schema } from "mongoose";
import Language from "../../../core/static/Language";

export const AddressSchema = new Schema({
    country: {
        type: String,
        required: true,
        get: (v: string) => v?.toLowerCase().trim(),
        set: (v: string) => v?.toLowerCase().trim()
    },
    region: {
        type: String,
        default: '',
        get: (v: string) => v?.toLowerCase().trim(),
        set: (v: string) => v?.toLowerCase().trim()
    },
    city: {
        type: String,
        required: true,
        get: (v: string) => v?.toLowerCase().replace('город', '').trim(),
        set: (v: string) => v?.toLowerCase().replace('город', '').trim()
    },
    address: {
        type: String,
        required: true,
        get: (v: string) => v?.toLowerCase().trim(),
        set: (v: string) => v?.toLowerCase().trim()
    },
    details: {
        type: String,
        default: ''
    },
    coords: {
        type: Array,
        validate: {
            validator: function(v: number[]) {
                return v.length == 2;
            },
            message: 'Path "coords" must be an array with length of 2'
        }
    },
    placeId: {
        type: String,
        default: function(this: IAddress) {
            return this.address;
        }
    },
    language: {
        type: String,
        required: false,
        default: 'ru',
        enum: Language.getList()
    }
});

interface IAddressSchema extends Document {
    country: string;
    region: string;
    city: string;
    address: string;
    details: string;
    coords: number[];
    formattedAddress: string;
    placeId: string;
    language: string;
};

interface IAddressBase extends IAddressSchema {

};

export interface IAddress extends IAddressBase {

};

export interface IAddressModel extends Model<IAddress> {

};

export const AddressModel = model<IAddress, IAddressModel>('address', AddressSchema);