import {Document, Schema, Types, Model, model} from 'mongoose';
import MyRegexp from 'myregexp';
import ContactType from '../../../core/static/ContactType';
import { IRef, RefSchema } from '../../ref/models/Ref';

const ContactSchema = new Schema({
    firstName: {
        value: {
            type: String,
            default: ''
        },
        custom: {
            type: Boolean,
            default: false
        }
    },
    lastName: {
        value: {
            type: String,
            default: ''
        },
        custom: {
            type: Boolean,
            default: false
        }
    },
    phone: {
        value: {
            type: String,
            default: ''
        },
        custom: {
            type: Boolean,
            default: false
        }
    },
    email: {
        value: {
            type: String,
            default: ''
        },
        custom: {
            type: Boolean,
            default: false
        }
    },
    socialNetworks: {
        vk: {
            value: {
                type: String,
                match: MyRegexp.url(),
                default: ''
            },
            custom: {
                type: Boolean,
                default: false
            }
        },
        fb: {
            value: {
                type: String,
                match: MyRegexp.url(),
                default: ''
            },
            custom: {
                type: Boolean,
                default: false
            }
        },
        insta: {
            value: {
                type: String,
                match: MyRegexp.url(),
                default: ''
            },
            custom: {
                type: Boolean,
                default: false
            }
        },
    },
    type: {
        type: String,
        required: true,
        enum: ContactType.getList()
    },
    ref: {
        type: Types.ObjectId,
        ref: 'user'
    },
    description: {
        value: {
            type: String,
            default: ''
        },
        custom: {
            type: Boolean,
            default: false
        }
    },
    activity: {
        value: {
            type: String,
            default: ''
        },
        custom: {
            type: Boolean,
            default: false
        }
    },
    contacts: [{
        type: Types.ObjectId,
        ref: 'contact'
    }],
    subscriptions: [{
        type: Types.ObjectId,
        ref: 'organization'
    }],
    coupons: [{
        type: Types.ObjectId,
        ref: 'coupon'
    }],
    website: {
        value: {
            type: String,
            default: ''
        },
        custom: {
            type: Boolean,
            default: false
        }
    },
    picture: {
        value: {
            type: String,
            default: ''
            //match: MyRegexp.url()
        },
        custom: {
            type: Boolean,
            default: false
        }
    },
    color: {
        type: String,
        default: '#007BED'
    },
    requestRef: RefSchema,
    employee: {
        type: Types.ObjectId,
        ref: 'employee'
    },
    client: {
        type: Types.ObjectId,
        ref: 'client'
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization'
    },
    tipsMessage: {
        type: String
    },
    rating: {
        type: Number
    },
    pictureMedia: {
        type: Types.ObjectId,
        ref: 'media'
    },
});

interface IContactSchema extends Document {
    firstName: {
        value: string;
        custom: boolean;
    };
    lastName: {
        value: string;
        custom: boolean;
    };
    email: {
        value: string;
        custom: boolean;
    };
    phone: {
        value: string;
        custom: boolean;
    };
    description: {
        value: string;
        custom: boolean;
    };
    type: string;
    socialNetworks: {
        vk: {
            value: string;
            custom: boolean;
        };
        fb: {
            value: string;
            custom: boolean;
        };
        insta: {
            value: string;
            custom: boolean;
        };
    },
    activity: {
        value: string;
        custom: boolean;
    };
    website: {
        value: string;
        custom: boolean;
    };
    picture: {
        value: string;
        custom: boolean;
    };
    color: string;
    requestRef: IRef;
    tipsMessage: string;
};

interface IContactBase extends IContactSchema {
    // methods and virtuals here
};

export interface IContact extends IContactBase {
    ref: Types.ObjectId;
    contacts: Types.ObjectId[];
    subscriptions: Types.ObjectId[];
    coupons: Types.ObjectId[];
    employee: Types.ObjectId;
    organization: Types.ObjectId;
    client: Types.ObjectId;
    pictureMedia: Types.ObjectId;
};

export interface IContactModel extends Model<IContact> {
    // STATICS
};

export const ContactModel = model<IContact, IContactModel>('contact', ContactSchema);