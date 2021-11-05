import {Types, Document, Model, model, Schema, HookNextFunction} from 'mongoose';
import MyRegexp from 'myregexp';
import Gender from '../../../core/static/Gender';
import bcrypt from 'bcrypt';
import { configProps } from '../../../services/config';
import { IRef, RefSchema } from '../../ref/models/Ref';
import LogType from '../../../core/static/LogType';
import UserRole from '../../../core/static/UserRole';
import { required } from 'joi';
import mongoose from 'mongoose';
import UserPlatform from '../../../core/static/UserPlatfrom';
import Country from '../../../core/static/Country';
import { ISubscription } from '../../finance/models/Subscription';
import Language from '../../../core/static/Language';
let deepPopulate = require('mongoose-deep-populate')(mongoose);

export const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    picture: {
        type: String,
        //match: MyRegexp.url()
    },
    pictureMedia: {
        type: Types.ObjectId,
        ref: 'media'
    },
    dob: {
        type: Date,
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        //match: MyRegexp.email(),
        
        validate: {
            validator: (v: IUser) => {
                return !v.phone
            },
            message: 'Email path is required when phone is not specified'
        },
        set: function(v: string) {
            return v?.toLowerCase();
        },
        //unique: true
        sparse: true
    },
    emailInfo: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        //match: MyRegexp.phone(),
        validate: {
            validator: (v: IUser) => {
                return !v.email
            },
            message: 'Email path is required when phone is not specified'
        },
        set: function(v: string) {
            return v?.replace(MyRegexp.phoneFormat(), '')
        },
        // unique: true,
        sparse: true
    },
    phoneInfo: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    adminGuest: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: Gender.getList()
    },
    activity: {
        type: String,
    },
    socialNetworks: {
        vk: {
            type: String,
            match: MyRegexp.url()
        },
        fb: {
            type: String,
            match: MyRegexp.url()
        },
        insta: {
            type: String,
            match: MyRegexp.url()
        }
    },
    contacts: [{
        type: Types.ObjectId,
        ref: 'contact'
    }],
    description: {
        type: String
    },
    requests: [{
        type: Types.ObjectId,
        ref: 'request'
    }],
    purchases: [{
        type: Types.ObjectId,
        ref: 'purchases'
    }],
    website: {
        type: String,
        match: MyRegexp.url()
    },
    wallet: {
        type: Types.ObjectId,
        ref: 'wallet'
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization'
    },
    pushToken: {
        type: String,
        default: ''
    },
    pushTokenBusiness: {
        type: String,
        default: ''
    },
    deviceToken: {
        type: String,
        default: ''
    },
    deviceTokenBusiness: {
        type: String,
        default: ''
    },
    pushNotificationsEnabled: {
        type: Boolean
    },
    language: {
        type: String,
        enum: Language.getList()
    },
    wisewinId: {
        type: String,
        default: ''
    },
    parent: {
        type: Types.ObjectId,
        ref: 'user'
    },
    ref: RefSchema,
    organizationPacketsSold: {
        type: Number,
        min: 0,
        default: 0
    },
    startPacketsSold: {
        type: Number,
        min: 0,
        default: 0
    },
    // logs: [{
    //     type: {
    //         type: String,
    //         required: true,
    //         enum: LogType.getList()
    //     },
    //     ref: {
    //         type: Types.ObjectId,
    //         required: true
    //     },
    //     timestamp: {
    //         type: Date,
    //         default: Date.now
    //     }
    // }],
    paymentCustomerId: {
        type: String,
        default: ''
    },
    paymentCardId: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: UserRole.getList()
    },
    platform: {
        type: String,
        enum: UserPlatform.getList()
    },
    address: {
        city: {
            type: String
        }
    },
    legal: {
        form: {
            type: String,
            //required: true
        },
        country: {
            type: String,
            enum: Country.getList()
        },
        info: {
            type: Schema.Types.Mixed,
            set: (info: Record<string, any>) => {
                for (const key in info) {
                    if (key.includes('.')) {
                        const newKey = key.replace('.', '_');
                        info[newKey] = info[key];
                        delete info[key];
                    }
                }

                return info;
            }
        }
    },
    application: {
        type: String
    }
});

UserSchema.plugin(deepPopulate, {});

interface IUserSchema extends Document {
    firstName: string;
    lastName: string;
    dob: Date,
    password: string;
    email: string;
    emailInfo: string;
    phone: string;
    phoneInfo: string;
    verified: boolean;
    gender: string;
    activity: string;
    socialNetworks: {
        vk: string;
        fb: string;
        insta: string;
    };
    description: string;
    website: string;
    picture: string;
    pushToken: string;
    pushTokenBusiness: string;
    deviceToken: string;
    deviceTokenBusiness: string;
    pushNotificationsEnabled: boolean;
    language: string;
    wisewinId: string;
    ref: IRef;
    organizationPacketsSold: number;
    startPacketsSold: number;
    admin: boolean;
    adminGuest: boolean;
    // logs: {
    //     type: String;
    //     ref: Types.ObjectId;
    //     timestamp: Date;
    // }[];
    paymentCustomerId: string;
    paymentCardId: string;
    role: string;
    platform: string;
    address: {
        city: string;
    };
    legal: {
        form: string;
        country: string;
        info: {[key: string]: string};
    };
    application: string;
};

UserSchema.plugin(deepPopulate, {
    
});

UserSchema.methods.comparePassword = async function(this: IUser, password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export interface IUserBase extends IUserSchema {
    // Describe all methods and virtuals here
    comparePassword(this: IUser, password: string): Promise<boolean>;
};

export interface IUser extends IUserBase {
    wallet: Types.ObjectId;
    contacts: Types.ObjectId[];
    requests: Types.ObjectId[];
    organization: Types.ObjectId;
    purchases: Types.ObjectId[];
    parent: Types.ObjectId;
    pictureMedia: Types.ObjectId;
};

export interface IUserModel extends Model<IUser> {
    // Statics here
    deepPopulate(path: string): Promise<ISubscription>;
};

UserSchema.pre('save', hashPassword);
UserSchema.pre('update', hashPassword);


export const UserModel = model<IUser, IUserModel>('user', UserSchema);

// hash password is a function that hashes password using the bcrypt library
function hashPassword(this: IUser, next: HookNextFunction) {
    if (!this.isModified('password')) return next();

    bcrypt.genSalt(configProps.saltWorkFactor, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            next();
        });
    });
}