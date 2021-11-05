export const IndividualLegalInfoSchema = {
    organizationName: {
        type: String,
        required: false,
        trim: true,
        set: (v: string) => {
            if (!v) return v;

            const formatted = v.toLowerCase().replace(/(^|\s)сз($|\s)/ig, '').replace(/(^|\s)самозанятый($|\s)/ig, '').replace(/(^|\s)самозанятая($|\s)/ig, '').trim()
            return formatted.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
        }
    },
    inn: {
        type: String,
        required: false,
        trim: true
    },
    ogrn: {
        type: String,
        required: false,
        trim: true
    },
    siteUrl: {
        type: String,
        required: false,
        trim: true
    },
    phone: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true
    },
    citizenship: {
        type: String,
        required: false,
        trim: true
    },
    dob: {
        type: Date,
        required: false
    },
    pob: {
        type: String,
        required: false,
        trim: true
    },
    document: {
        type: {
            type: String,
            required: false,
            trim: true
        },
        issueDate: {
            type: Date,
            required: false
        },
        issuedBy: {
            type: String,
            required: false,
            trim: true
        },
        serialNumber: {
            type: String,
            required: false,
            trim: true
        },
        departmentCode: {
            type: String,
            required: false,
            trim: true
        }
    },
    addresses: {
        legal: {
            country: {
                type: String,
                required: false,
                trim: true
            },
            city: {
                type: String,
                required: false,
                trim: true
            },
            street: {
                type: String,
                required: false,
                trim: true
            },
            zip: {
                type: String,
                required: false,
                trim: true
            }
        },
        mailing: {
            country: {
                type: String,
                required: false,
                trim: true
            },
            city: {
                type: String,
                required: false,
                trim: true
            },
            street: {
                type: String,
                required: false,
                trim: true
            },
            zip: {
                type: String,
                required: false,
                trim: true
            }
        }
    },
    bankAccount: {
        account: {
            type: String,
            required: false,
            trim: true
        },
        name: {
            type: String,
            required: false,
            trim: true
        },
        bik: {
            type: String,
            required: false,
            trim: true
        },
        korAccount: {
            type: String,
            required: false,
            trim: true
        }
    }
};

export interface IIndividualLegalInfo {
    organizationName: string;
    inn: string;
    ogrn: string;
    siteUrl: string;
    phone: string;
    email: string;
    citizenship: string;
    dob: Date;
    pob: string;
    document: {
        type: string;
        issueDate: Date;
        issuedBy: string;
        serialNumber: string;
        departmentCode: string;
    };
    addresses: {
        legal: {
            country: string;
            city: string;
            street: string;
            zip: string;
        };
        mailing: {
            country: string;
            city: string;
            street: string;
            zip: string;
        };
    };
    bankAccount: {
        account: string;
        name: string;
        bik: string;
        korAccount: string;
    };
};