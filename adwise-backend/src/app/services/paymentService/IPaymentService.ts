import { Result } from "../../core/models/Result";
import { IPayment } from "../../modules/finance/models/Payment";

export interface ICreatePaymentData {
    amount: {
        value: string;
        currency: string;
    };
    metadata: {
        [key: string]: any;
    };
    confirmation: {
        type: string;
        return_url: string;
    };
    capture: boolean;
    description: string;
};

export interface IPaymentCreatedData {
    id: string;
    status: string;
    paid: boolean;
    amount: {
      value: number;
      currency: string;
    };
    confirmation: {
      type: string;
      confirmation_url: string;
    };
    created_at: Date;
    description: string;
    metadata: {[key: string]: any};
    recipient: {
      account_id: string;
      gateway_id: string;
    };
    refundable: boolean;
    test: boolean;
};

export interface IShop {
    ShopCode: string;
    Amount: number;
    Name: string;
};

export interface IReceiptItem {
    Name: string;
    Quantity: number;
    Amount: number;
    Price: number;
    Tax: string;
    PaymentObject: string; 
    AgentData?: any;
    SupplierInfo?: any;
    Id?: string;
};

export interface IReceipt {
    Email?: string;
    Phone?: string;
    EmailCompany: string;
    Taxation: string;
    Items: IReceiptItem[];
    AgentData?: any;
    SupplierInfo?: any;
};

export interface IRegistrationData {
    billingDescriptor: string;
    fullName: string;
    name: string;
    inn: string;
    kpp: string;
    ogrn: string;
    addresses: {
        type: 'legal' | 'actual' | 'post' | 'other';
        zip: string;
        country: 'RUS';
        city: string;
        street: string;
    }[];
    phones: {
        type: 'common' | 'fax' | 'other';
        phone: string;
    }[];
    email: string;
    ceo: {
        firstName: string;
        lastName: string;
        middleName: string;
        birthDate: string;
        phone: string;
    };
    siteUrl: string;
    bankAccount: {
        account: string;
        korAccount: string;
        bankName: string;
        bik: string;
        details: string;
        tax: number;
    };
    shopArticleId: string;
};

export interface IShopCreatedData {
    code: string;
    shopCode: string;
    terminals: string[];
};

export interface ICustomerAddedData {
    TerminalKey: string;
    CustomerKey: string;
    Success: boolean;
    ErrorCode: string;
};

export interface ICardAddedData {
    TerminalKey: string;
    CustomerKey: string;
    RequestKey: string;
    PaymentUrl: string;
    Success: boolean;
    ErrorCode: string;
};

export interface ICardRemovedData {
    TerminalKey: string;
    CustomerKey: string;
    CardId: string;
    Status: string;
    Success: boolean;
    ErrorCode: string;
};

export interface INotificationsResentData {
    Success : boolean;
    ErrorCode : string;
    TerminalKey : string;
    Count : number;
};

export interface ISupplierInfo {
    Phones: string[];
    Name: string;
    Inn: string;
};

export interface ISignResponse {
    DigestValue: string;
    SignatureValue: string;
    X509SerialNumber: string;
};

export interface ICard {
    Pan: string;
    CardId: string;
    RebillId: number;
    CardType: number;
    ExpDate: string;
    Status: string;
};

export interface IPaymentConfirmedData {
    TerminalKey: string;
    OrderId: string;
    Success: string;
    Status: string;
    PaymentId: string;
    ErrorCode: string;
    Mesage: string;
};

export type TerminalType = 'default' | 'split' | 'safe';

export interface IPaymentCanceledData {
    TerminalKey: string;
    OrderId: string;
    Success: boolean;
    Status: string;
    PaymentId: string;
    ErrorCode: string;
    Message: string;
    OriginalAmount: number;
    NewAmount: number;
};

export interface IPaymentService {
    successfulStatus: string;
    failureStatus: string;
    canceledStatus: string;
    createPayment(sum: number, currency: string, description: string, paymentId: string): Promise<Result<IPaymentCreatedData | null, Error | null>>;
    createReceipt(sum: number, currency: string, description: string, paymentId: string, purchaserContact: string, items: IReceiptItem[], supplierInfo: ISupplierInfo): Promise<Result<IPaymentCreatedData | null, Error | null>>;
    createReceiptSplit(sum: number, currency: string, description: string, paymentId: string, purchaserContact: string, items: IReceiptItem[], shops: IShop[], supplierInfo: ISupplierInfo): Promise<Result<IPaymentCreatedData | null, Error | null>>;
    validateNotification(ip: string): boolean;
    createShop(data: IRegistrationData): Promise<Result<IShopCreatedData | null, Error | null>>;
    resendNotifications(type: TerminalType): Promise<Result<INotificationsResentData | null, Error | null>>;

    addCustomer(customerId: string): Promise<Result<ICustomerAddedData | null, Error | null>>;
    addCard(customerId: string): Promise<Result<ICardAddedData | null, Error | null>>;
    deleteCard(customerId: string, cardId: string): Promise<Result<ICardRemovedData | null, Error | null>>;
    getCards(customerId: string): Promise<Result<ICard[] | null, Error | null>>;
    createPayment(sum: number, currency: string, description: string, paymentId: string): Promise<Result<IPaymentCreatedData | null, Error | null>>;

    createReceiptSafe(sum: number, currency: string, description: string, paymentId: string, purchaserContact: string, items: IReceiptItem[], supplierInfo: ISupplierInfo, accumulationId?: string): Promise<Result<IPaymentCreatedData | null, Error | null>>;
    createPaymentSafe(sum: number, currency: string, description: string, paymentId: string, accumulationId?: string): Promise<Result<IPaymentCreatedData | null, Error | null>>;
    initPaymentSafe(sum: number, currency: string, paymentId: string, accumulationId: string, cardId: string): Promise<Result<IPaymentCreatedData | null, Error | null>>;
    confirmPaymentSafe(paymentId: string): Promise<Result<IPaymentConfirmedData | null, Error | null>>;

    checkPaymentConfirmed(paymentId: string, type: TerminalType): Promise<Result<boolean | null, Error | null>>;

    cancelPayment(paymentId: string, amount: number, type: TerminalType): Promise<Result<IPaymentCanceledData | null, Error | null>>;
};