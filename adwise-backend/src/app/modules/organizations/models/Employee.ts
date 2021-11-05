import { Document, model, Model, Schema, Types } from "mongoose";
import Currency from "../../../core/static/Currency";
import EmployeeRole from "../../../core/static/EmployeeRole";
const Double = require('@mongoosejs/double');

const EmployeeSchema = new Schema({
    role: {
        type: String,
        required: true,
        enum: EmployeeRole.getList()
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    contact: {
        type: Types.ObjectId,
        ref: 'contact',
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    purchasesInOrganization: {
        sum: {
            type: Double,
            default: 0,
            min: 0
        },
        currency: {
            type: String,
            enum: Currency.getList(),
            required: true
        }
    },
    refPoints: {
        sum: {
            type: Double,
            default: 0,
            min: 0
        },
        currency: {
            type: String,
            enum: Currency.getList(),
            required: true
        }
    },
    refPurchases: {
        sum: {
            type: Double,
            default: 0,
            min: 0
        },
        currency: {
            type: String,
            enum: Currency.getList(),
            required: true
        }
    },
    refsFirstLevel: {
        type: Number,
        default: 0
    },
    refsOtherLevels: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        set: (v: number) => v.toFixed(2)
    }
});

interface IEmployeeSchema extends Document {
    role: string;
    disabled: boolean;
    purchasesInOrganization: {
        sum: number;
        currency: string;
    };
    refPoints: {
        sum: number;
        currency: string;
    };
    refPurchases: {
        sum: number;
        currency: string;
    };
    refsFirstLevel: number;
    refsOtherLevels: number;
    rating: number;
};

interface IEmployeeBase extends IEmployeeSchema {

};

export interface IEmployee extends IEmployeeBase {
    organization: Types.ObjectId;
    contact: Types.ObjectId;
    user: Types.ObjectId;
};

export interface IEmployeeModel extends Model<IEmployee> {

};

export const EmployeeModel = model<IEmployee, IEmployeeModel>('employee', EmployeeSchema);