export const OOOLegalInfoSchema = {
    organizationName: {
        type: String,
        required: false,
        trim: true,
        set: (v: string) => {
            if (!v) return v;

            const formatted = v.toLowerCase().replace(/(^|\s)ооо($|\s)/ig, '').replace(/(^|\s)общество с ограниченной ответственностью($|\s)/ig, '').replace(/[\'\"]/ig, '').trim();
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
    kpp: {
        type: String,
        required: false,
        trim: true
    },
    siteUrl: {
        type: String,
        required: false,
        trim: true
    },
    billingDescriptor: {
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
    },
    ceo: {
        firstName: {
            type: String,
            required: false,
            trim: true
        },
        lastName: {
            type: String,
            required: false,
            trim: true
        },
        middleName: {
            type: String,
            required: false,
            trim: true
        },
        address: {
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
        citizenship: {
            type: String,
            required: false,
            trim: true
        },
        phone: {
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
                required: false,
                trim: true
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
        }
    },
    founder: {
        firstName: {
            type: String,
            required: false,
            trim: true
        },
        lastName: {
            type: String,
            required: false,
            trim: true
        },
        middleName: {
            type: String,
            required: false,
            trim: true
        },
        address: {
            type: String,
            required: false,
            trim: true
        },
        dob: {
            type: Date,
            required: false,
        },
        pob: {
            type: String,
            required: false,
            trim: true
        },
        citizenship: {
            type: String,
            required: false,
            trim: true
        },
        phone: {
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
        }
    }
};

export interface IOOOLegalInfo {
    organizationName: string;
    inn: string;
    ogrn: string;
    kpp: string;
    siteUrl: string;
    billingDescriptor: string;
    phone: string;
    email: string;
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
    ceo: {
        firstName: string;
        lastName: string;
        middleName: string;
        address: string;
        dob: Date;
        pob: string;
        citizenship: string;
        phone: string;
        document: {
            type: string;
            issueDate: Date;
            issuedBy: string;
            serialNumber: string;
            departmentCode: string;
        };
    };
    founder: {
        firstName: string;
        lastName: string;
        middleName: string;
        address: string;
        dob: Date;
        pob: string;
        citizenship: string;
        phone: string;
        document: {
            type: string;
            issueDate: Date;
            issuedBy: string;
            serialNumber: string;
            departmentCode: string;
        };
    };
};