import { Document, model, Model, Schema, Types } from "mongoose";

const EmployeeRatingSchema = new Schema({
    employee: {
        type: Types.ObjectId,
        ref: 'employee',
        required: true
    },
    employeeContact: {
        type: Types.ObjectId,
        ref: 'contact',
        required: true
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'user',
        // required: true
    },
    purchaserContact: {
        type: Types.ObjectId,
        ref: 'contact'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        set: (v: number) => Number(v.toFixed(2))
    },
    comment: {
        type: String,
        default: ''
    },
    purchase: {
        type: Types.ObjectId,
        ref: 'purchase'
    }
});

interface IEmployeeRatingSchema extends Document {
    rating: number;
    comment: string;
};

interface IEmployeeRatingBase extends IEmployeeRatingSchema {

};

export interface IEmployeeRating extends IEmployeeRatingBase {
    employee: Types.ObjectId;
    organization: Types.ObjectId;
    user: Types.ObjectId;
    purchaserContact: Types.ObjectId;
    employeeContact: Types.ObjectId;
    purchase: Types.ObjectId;
};

export interface IEmployeeRatingModel extends Model<IEmployeeRating> {

};

export const EmployeeRatingModel = model<IEmployeeRating, IEmployeeRatingModel>('employeerating', EmployeeRatingSchema);