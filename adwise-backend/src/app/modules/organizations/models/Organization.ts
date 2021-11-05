import { Document, model, Model, Schema, Types } from "mongoose";
import MyRegexp from "myregexp";
import { CategorySchema, ICategory } from "./Category";
import { IPacket, PacketSchema } from "./Packet";
import { ITag, TagSchema } from "./Tag";
import OrganizationType from "../../../core/static/OrganizationType";
import { IRef, RefSchema } from "../../ref/models/Ref";
import Country from "../../../core/static/Country";
import { DistributionSchema, IDistribution } from "./DistributionSchema";
import OrganizationPaymentType from "../../../core/static/OrganizationPaymentType";
import { string } from "joi";
import { AddressSchema, IAddress } from "../../maps/models/Address";
const Double = require('@mongoosejs/double');

export const OrganizationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    briefDescription: {
        type: String,
        required: true
    },
    description: {
        type: String,
        //required: true
    },
    picture: {
        type: String,
        //required: true
    },
    mainPicture: {
        type: String,
        //required: true
    },
    pictureMedia: {
        type: Types.ObjectId,
        ref: 'media'
    },
    mainPictureMedia: {
        type: Types.ObjectId,
        ref: 'media'
    },
    tags: [TagSchema],
    clients: [{
        type: Types.ObjectId,
        ref: 'contact'
    }],
    website: {
        type: String,
    },
    address: AddressSchema,
    socialNetworks: {
        vk: {
            type: String,
            default: ''
        },
        fb: {
            type: String,
            default: ''
        },
        insta: {
            type: String,
            default: ''
        }
    },
    emails: [{
        type: String,
        match: MyRegexp.email()
    }],
    phones: [{
        type: String,
        match: MyRegexp.phone()
    }],
    employees: [{
        type: Types.ObjectId,
        ref: 'contact'
    }],
    category: CategorySchema,
    verified: {
        type: Boolean,
        default: false
    },
    coupons: [{
        type: Types.ObjectId,
        ref: 'coupon'
    }],
    wallet: {
        type: Types.ObjectId,
        ref: 'wallet'
    },
    pictures: [{
        type: String
    }],
    distributionSchema: DistributionSchema,
    schedule: {
        monday: {
            from: {
                type: String,
            },
            to: {
                type: String,
            }
        },
        tuesday: {
            from: {
                type: String,
            },
            to: {
                type: String,
            }
        },
        wednesday: {
            from: {
                type: String,
            },
            to: {
                type: String,
            }
        },
        thursday: {
            from: {
                type: String,
            },
            to: {
                type: String,
            }
        },
        friday: {
            from: {
                type: String,
            },
            to: {
                type: String,
            }
        },
        saturday: {
            from: {
                type: String,
            },
            to: {
                type: String,
            }
        },
        sunday: {
            from: {
                type: String,
            },
            to: {
                type: String,
            }
        }
    },
    colors: {
        primary: {
            type: String,
            default: '#0085FF'
        },
        secondary: {
            type: String,
            default: '#0085FF'
        }
    },
    user: {
        type: Types.ObjectId,
        ref: 'user'
    },
    packet: {
        type: PacketSchema,
        required: false
    },
    cashback: {
        type: Double,
        min: 0,
        max: 100,
        default: 10
    },
    legal: {
        form: {
            type: String,
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
    previousPaymentInfo: [{
        shopId: {
            type: String,
            required: true
        },
        info: {
            type: Schema.Types.Mixed,
            required: true,
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
    }],
    manager: {
        type: Types.ObjectId,
        ref: 'user'
    },
    products: [{
        type: Types.ObjectId,
        ref: 'product'
    }],
    ref: RefSchema,
    defaultCashier: {
        type: Types.ObjectId,
        ref: 'contact'
    },
    disabled: {
        type: Boolean,
        default: true
    },
    application: {
        type: String,
        default: ''
    },
    treaty: {
        type: String,
        default: ''
    },
    signed: {
        type: Boolean,
        default: false
    },
    cash: {
        type: Boolean,
        default: false
    },
    online: {
        type: Boolean,
        default: true
    },
    paymentType: {
        type: String,
        default: 'default',
        enum: OrganizationPaymentType.getList()
    },
    paymentShopId: {
        type: String
    },
    tips: {
        type: Boolean,
        default: false
    },
    lastFinancialReport: {
        type: String
    },
    packetPaymentAct: {
        type: String
    },
    demo: {
        type: Boolean
    },
    availableGlobally: {
        type: Boolean,
        default: false
    },
    requestedPacket: PacketSchema
});

type Day = {
    from: string;
    to: string;
}

interface ISchedule {
    monday: Day;
    tuesday: Day;
    wednesday: Day;
    thursday: Day;
    friday: Day;
    saturday: Day;
    sunday: Day;
};

interface IOrganizationSchema extends Document {
    demo: boolean;
    name: string;
    description: string;
    briefDescription: string;
    picture: string;
    mainPicture: string;
    tags: ITag[];
    website: string;
    address: IAddress;
    socialNetworks: {
        vk: string;
        fb: string;
        insta: string;
    };
    emails: string[];
    phones: string[];
    category: ICategory;
    verified: boolean;
    pictures: string[];
    distributionSchema: IDistribution;
    schedule: ISchedule;
    colors: {
        primary: string;
        secondary: string;
    },
    packet: IPacket;
    cashback: number;
    legal: {
        form: string;
        country: string;
        info: {[key: string]: any};
    };
    ref: IRef;
    disabled: boolean;
    application: string;
    treaty: string;
    signed: boolean;
    paymentShopId: string;
    previousPaymentInfo: {
        shopId: string;
        info: {[key: string]: any};
    }[];
    cash: boolean;
    online: boolean;
    paymentType: string;
    tips: boolean;
    lastFinancialReport: string;
    packetPaymentAct: string;
    availableGlobally: boolean;
    requestedPacket: IPacket;
    // deposit: number;
};

interface IOrganizationBase extends IOrganizationSchema {

};

export interface IOrganization extends IOrganizationBase {
    clients: Types.ObjectId[];
    employees: Types.ObjectId[];
    coupons: Types.ObjectId[];
    wallet: Types.ObjectId;
    user: Types.ObjectId;
    manager: Types.ObjectId;
    products: Types.ObjectId[];
    defaultCashier: Types.ObjectId;
    pictureMedia: Types.ObjectId;
    mainPictureMedia: Types.ObjectId;
};

export interface IOrganizationModel extends Model<IOrganization> {

};

export const OrganizationModel = model<IOrganization, IOrganizationModel>('organization', OrganizationSchema);