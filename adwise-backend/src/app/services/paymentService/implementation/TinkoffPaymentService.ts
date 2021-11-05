import { Result } from "../../../core/models/Result";
import { IPaymentService, IPaymentCreatedData, IReceiptItem , IReceipt, IRegistrationData, IShopCreatedData, IShop, ICustomerAddedData, ICardAddedData, INotificationsResentData, ISupplierInfo, ISignResponse, ICardRemovedData, ICard, IPaymentConfirmedData, TerminalType, IPaymentCanceledData} from "../IPaymentService";
import axios, {AxiosInstance} from 'axios';
import crypto from 'crypto';
import { logger } from "../../logger";
import MyRegexp from "myregexp";
import FormData from 'form-data';
import { request } from "http";
import { URLSearchParams } from "url";
import { string } from "joi";

export class TinkoffPaymentService implements IPaymentService {
    private apiKeyDefault: string;
    private passwordDefault: string;

    private apiKeySplit: string;
    private passwordSplit: string;

    private apiKeySafe: string;
    private apiKeySafeETC: string;
    private passwordSafe: string;

    private userName: string;
    private userPassword: string;

    private transport: AxiosInstance;
    private registrationTransport: AxiosInstance;
    private splitTransport: AxiosInstance;
    private etcTransport: AxiosInstance;
    private safeTransport: AxiosInstance;

    private signKey: string;
    private signTransport: AxiosInstance;

    private email: string;
    private accessToken: {
        value: string;
        expirationDate: Date;
    };

    public successfulStatus = 'CONFIRMED';
    public failureStatus = 'REJECTED';
    public canceledStatus = 'REFUNDED';

    constructor(
        apiKeyDefault: string, 
        passwordDefault: string, 
        apiKeySplit: string, 
        passwordSplit: string, 
        apiKeySafe: string,
        apiKeySafeETC: string, 
        passwordSafe: string, 
        email: string, 
        userName: string, 
        userPassword: string, 
        registrationBaseUrl: string, 
        etcUrl: string, 
        defaultUrl: string, 
        splitUrl: string, 
        safeUrl: string, 
        signUrl: string, 
        signKey: string
    ) {
        this.apiKeyDefault = apiKeyDefault;
        this.passwordDefault = passwordDefault;
        
        this.apiKeySplit = apiKeySplit;
        this.passwordSplit = passwordSplit;

        this.apiKeySafe = apiKeySafe;
        this.apiKeySafeETC = apiKeySafeETC;
        this.passwordSafe = passwordSafe;

        this.signKey = signKey;
        this.signTransport = this.configureTransport(signUrl);

        this.transport = this.configureTransport(defaultUrl);
        this.splitTransport = this.configureTransport(splitUrl);
        this.registrationTransport = this.configureTransport(registrationBaseUrl);
        this.etcTransport = this.configureTransport(etcUrl);
        this.safeTransport = this.configureTransport(safeUrl);

        this.email = email;
        this.userName = userName;
        this.userPassword = userPassword;
        this.accessToken = {
            value: '',
            expirationDate: new Date(0)
        };
    }

    public async createPayment(sum: number, currency: string, description: string, paymentId: string): Promise<Result<IPaymentCreatedData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeyDefault,
                Amount: sum*100,
                OrderId: paymentId,
                Description: description,
                Password: this.passwordDefault
            };
            
            const response = await this.transport.post('/Init', {
                ...body,
                Token: this.signRequest(body)
            });

            const data = response.data;

            if (data.Status == 'REJECTED'  || !data.Success) {
                throw new Error(data.Message + " " + data.Details);
            }

            return Result.ok({
                amount: {
                    currency: currency,
                    value: data.Amount / 100
                },
                confirmation: {
                    confirmation_url: data.PaymentURL,
                    type: 'redirect'
                },
                created_at: new Date(),
                description: description,
                id: data.PaymentId,
                metadata: {
                    id: paymentId
                },
                paid: false,
                recipient: {
                    account_id: '',
                    gateway_id: ''
                },
                refundable: true,
                status: data.Status,
                test: true
            });
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async createReceipt(sum: number, currency: string, description: string, paymentId: string, purchaserContact: string, items: IReceiptItem[], supplierInfo: ISupplierInfo): Promise<Result<IPaymentCreatedData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeyDefault,
                Amount: sum*100,
                OrderId: paymentId,
                Description: description,
                Password: this.passwordDefault
            };

            items = items.map(i => {
                i.AgentData = {
                    AgentSign: "another",
                    OperationName: "Оплата",
                    // Phones: ["+73432264796"],
                    // ReceiverPhones: ["+73432264796"],
                    // TransferPhones: ["+73432264796"],
                    OperatorName: "Эдвайз ООО",
                    OperatorAddress: "620075, Свердловская обл, г. Екатеринбург, улица Малышева, 51, оф 6/8",
                    OperatorInn: "6685180761"
                },
                i.SupplierInfo = supplierInfo

                return i;
            });

            const receipt: IReceipt = {
                Items: items,
                EmailCompany: this.email,
                Taxation: 'usn_income',
                // AgentData: {
                //     AgentSign: "paying_agent",
                //     OperationName: "Оплата",
                //     Phones: ["+73432264796"],
                //     ReceiverPhones: ["+73432264796"],
                //     TransferPhones: ["+73432264796"],
                //     OperatorName: "Эдвайз ООО",
                //     OperatorAddress: "620075, Свердловская обл, г. Екатеринбург, улица Малышева, 51, оф 6/8",
                //     OperatorInn: "6685180761"
                // },
                // SupplierInfo: supplierInfo
            };

            if (MyRegexp.email().test(purchaserContact)) {
                receipt.Email = purchaserContact;
            } else {
                receipt.Phone = purchaserContact;
            }
            
            const response = await this.transport.post('/Init', {
                ...body,
                Token: this.signRequest(body),
                Receipt: receipt
            });

            const data = response.data;
            if (data.Status == 'REJECTED' || !data.Success) {
                throw new Error(data.Message + " " + data.Details);
            }

            return Result.ok({
                amount: {
                    currency: currency,
                    value: data.Amount / 100
                },
                confirmation: {
                    confirmation_url: data.PaymentURL,
                    type: 'redirect'
                },
                created_at: new Date(),
                description: description,
                id: data.PaymentId,
                metadata: {
                    id: paymentId
                },
                paid: false,
                recipient: {
                    account_id: '',
                    gateway_id: ''
                },
                refundable: true,
                status: data.Status,
                test: true
            })
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async createReceiptSplit(sum: number, currency: string, description: string, paymentId: string, purchaserContact: string, items: IReceiptItem[], shops: IShop[], supplierInfo: ISupplierInfo): Promise<Result<IPaymentCreatedData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeySplit,
                Amount: sum*100,
                OrderId: paymentId,
                Description: description,
                Password: this.passwordSplit,
                Shops: shops
            };

            items = items.map(i => {
                i.AgentData = {
                    AgentSign: "another",
                    OperationName: "Оплата",
                    // Phones: ["+73432264796"],
                    // ReceiverPhones: ["+73432264796"],
                    // TransferPhones: ["+73432264796"],
                    OperatorName: "Эдвайз ООО",
                    OperatorAddress: "620075, Свердловская обл, г. Екатеринбург, улица Малышева, 51, оф 6/8",
                    OperatorInn: "6685180761"
                },
                i.SupplierInfo = supplierInfo
                return i;
            });

            const receipt: IReceipt = {
                Items: items,
                EmailCompany: this.email,
                Taxation: 'usn_income',
                // AgentData: {
                //     AgentSign: "paying_agent",
                //     OperationName: "Оплата",
                //     Phones: ["+73432264796"],
                //     ReceiverPhones: ["+73432264796"],
                //     TransferPhones: ["+73432264796"],
                //     OperatorName: "Эдвайз ООО",
                //     OperatorAddress: "620075, Свердловская обл, г. Екатеринбург, улица Малышева, 51, оф 6/8",
                //     OperatorInn: "6685180761"
                // },
                // SupplierInfo: supplierInfo
            };

            if (MyRegexp.email().test(purchaserContact)) {
                receipt.Email = purchaserContact;
            } else {
                receipt.Phone = purchaserContact;
            }
            
            const response = await this.splitTransport.post('/Init', {
                ...body,
                Token: this.signRequest(body),
                Receipt: receipt
            });

            const data = response.data;
            if (data.Status == 'REJECTED' || !data.Success) {
                console.log(data);
                throw new Error(data.Message + " " + data.Details);
            }

            return Result.ok({
                amount: {
                    currency: currency,
                    value: data.Amount / 100
                },
                confirmation: {
                    confirmation_url: data.PaymentURL,
                    type: 'redirect'
                },
                created_at: new Date(),
                description: description,
                id: data.PaymentId,
                metadata: {
                    id: paymentId
                },
                paid: false,
                recipient: {
                    account_id: '',
                    gateway_id: ''
                },
                refundable: true,
                status: data.Status,
                test: true
            })
        } catch (ex) {
            console.log(ex);
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async createReceiptSafe(sum: number, currency: string, description: string, paymentId: string, purchaserContact: string, items: IReceiptItem[], supplierInfo: ISupplierInfo, accumulationId?: string): Promise<Result<IPaymentCreatedData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeySafe,
                Amount: sum*100,
                OrderId: paymentId,
                Description: description,
                Password: this.passwordSafe
            };

            items = items.map(i => {
                i.AgentData = {
                    AgentSign: "another",
                    OperationName: "Оплата",
                    // Phones: ["+73432264796"],
                    // ReceiverPhones: ["+73432264796"],
                    // TransferPhones: ["+73432264796"],
                    OperatorName: "Эдвайз ООО",
                    OperatorAddress: "620075, Свердловская обл, г. Екатеринбург, улица Малышева, 51, оф 6/8",
                    OperatorInn: "6685180761"
                },
                i.SupplierInfo = supplierInfo
                return i;
            });

            const receipt: IReceipt = {
                Items: items,
                EmailCompany: this.email,
                Taxation: 'usn_income',
                // AgentData: {
                //     AgentSign: "paying_agent",
                //     OperationName: "Оплата",
                //     Phones: ["+73432264796"],
                //     ReceiverPhones: ["+73432264796"],
                //     TransferPhones: ["+73432264796"],
                //     OperatorName: "Эдвайз ООО",
                //     OperatorAddress: "620075, Свердловская обл, г. Екатеринбург, улица Малышева, 51, оф 6/8",
                //     OperatorInn: "6685180761"
                // },
                // SupplierInfo: supplierInfo
            };

            if (MyRegexp.email().test(purchaserContact)) {
                receipt.Email = purchaserContact;
            } else {
                receipt.Phone = purchaserContact;
            }

            const bodyData: {
                StartSpAccumulation?: boolean;
                SpAccumulationId?: string
            } = {

            };

            if (accumulationId) {
                bodyData.SpAccumulationId = accumulationId;
            } else {
                bodyData.StartSpAccumulation = true;
            }
            
            const response = await this.safeTransport.post('/Init', {
                ...body,
                DATA: bodyData,
                Token: this.signRequest(body),
                Receipt: receipt
            });

            const data = response.data;

            if (data.Status == 'REJECTED' || !data.Success) {
                console.log(data);
                throw new Error(data.Message + " " + data.Details);
            }

            return Result.ok({
                amount: {
                    currency: currency,
                    value: data.Amount / 100
                },
                confirmation: {
                    confirmation_url: data.PaymentURL,
                    type: 'redirect'
                },
                created_at: new Date(),
                description: description,
                id: data.PaymentId,
                metadata: {
                    id: paymentId
                },
                paid: false,
                recipient: {
                    account_id: '',
                    gateway_id: ''
                },
                refundable: true,
                status: data.Status,
                test: true
            });
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async addCustomer(customerId: string): Promise<Result<ICustomerAddedData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeySafeETC,
                CustomerKey: customerId,
            };

            const requestSigned = await this.signRequestCryptoPro(body);
            if (requestSigned.isFailure) {
                throw requestSigned.getError();
            }

            const signatures = requestSigned.getValue()!;

            const urlencodedData: {[key: string]: string} = {};
            
            urlencodedData['TerminalKey'] = this.apiKeySafeETC;
            urlencodedData['CustomerKey'] = customerId;
            urlencodedData['DigestValue'] = signatures.DigestValue;
            urlencodedData['SignatureValue'] = signatures.SignatureValue;
            urlencodedData['X509SerialNumber'] = signatures.X509SerialNumber;

            const urlencoded = Object.entries(urlencodedData).map(([k, v]) => `${k}=${v}`).join('&');

            console.log(urlencoded);

            const response = await this.etcTransport.post('/AddCustomer', urlencoded, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });

            const { data } = response;

            console.log(response);

            if (!data.Success) {
                throw new Error(data.Message);
            }

            return Result.ok({
                CustomerKey: data.CustomerKey,
                ErrorCode: data.ErrorCode,
                Success: data.Success,
                TerminalKey: data.TerminalKey
            });
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async addCard(customerId: string): Promise<Result<ICardAddedData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeySafeETC,
                CustomerKey: customerId,
                CheckType: 'HOLD'
            };

            console.time('signing');
            const requestSigned = await this.signRequestCryptoPro(body);
            if (requestSigned.isFailure) {
                throw requestSigned.getError();
            }
            console.timeEnd('signing');

            const signatures = requestSigned.getValue()!;

            const urlencodedData: {[key: string]: string} = {};
            
            urlencodedData['TerminalKey'] = this.apiKeySafeETC;
            urlencodedData['CustomerKey'] = customerId;
            urlencodedData['CheckType'] = 'HOLD';

            urlencodedData['DigestValue'] = signatures.DigestValue;
            urlencodedData['SignatureValue'] = signatures.SignatureValue;
            urlencodedData['X509SerialNumber'] = signatures.X509SerialNumber;

            const urlencoded = Object.entries(urlencodedData).map(([k, v]) => `${k}=${v}`).join('&');

            console.log(urlencoded);

            console.time('tinkoff');
            const response = await this.etcTransport.post('/AddCard', urlencoded, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
            console.timeEnd('tinkoff');

            const { data } = response;

            console.log(data);

            if (!data.Success) {
                throw new Error(data.Message);
            }

            return Result.ok({
                CustomerKey: data.CustomerKey,
                ErrorCode: data.ErrorCode,
                Success: data.Success,
                TerminalKey: data.TerminalKey,
                PaymentUrl: data.PaymentURL,
                RequestKey: data.RequestKey
            });
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async deleteCard(customerId: string, cardId: string): Promise<Result<ICardRemovedData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeySafeETC,
                CustomerKey: customerId,
                CardId: cardId
            };

            const requestSigned = await this.signRequestCryptoPro(body);
            if (requestSigned.isFailure) {
                throw requestSigned.getError();
            }

            const signatures = requestSigned.getValue()!;

            const urlencodedData: {[key: string]: string} = {};
            
            urlencodedData['TerminalKey'] = this.apiKeySafeETC;
            urlencodedData['CustomerKey'] = customerId;
            urlencodedData['CardId'] = cardId;

            urlencodedData['DigestValue'] = signatures.DigestValue;
            urlencodedData['SignatureValue'] = signatures.SignatureValue;
            urlencodedData['X509SerialNumber'] = signatures.X509SerialNumber;

            const urlencoded = Object.entries(urlencodedData).map(([k, v]) => `${k}=${v}`).join('&');

            console.log(urlencoded);

            const response = await this.etcTransport.post('/RemoveCard', urlencoded, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });

            const { data } = response;

            console.log(data);

            if (!data.Success) {
                throw new Error(data.Message);
            }

            return Result.ok({
                CustomerKey: data.CustomerKey,
                ErrorCode: data.ErrorCode,
                Success: data.Success,
                TerminalKey: data.TerminalKey,
                CardId: data.CardId,
                Status: data.Status
            });
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async getCards(customerId: string): Promise<Result<ICard[] | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeySafeETC,
                CustomerKey: customerId
            };

            const requestSigned = await this.signRequestCryptoPro(body);
            if (requestSigned.isFailure) {
                throw requestSigned.getError();
            }

            const signatures = requestSigned.getValue()!;

            const urlencodedData: {[key: string]: string} = {};
            
            urlencodedData['TerminalKey'] = this.apiKeySafeETC;
            urlencodedData['CustomerKey'] = customerId;

            urlencodedData['DigestValue'] = signatures.DigestValue;
            urlencodedData['SignatureValue'] = signatures.SignatureValue;
            urlencodedData['X509SerialNumber'] = signatures.X509SerialNumber;

            const urlencoded = Object.entries(urlencodedData).map(([k, v]) => `${k}=${v}`).join('&');

            console.log(urlencoded);

            const response = await this.etcTransport.post('/GetCardList', urlencoded, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });

            const { data } = response;

            console.log(data);

            return Result.ok(data);
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async createPaymentSafe(sum: number, currency: string, description: string, paymentId: string, accumulationId?: string): Promise<Result<IPaymentCreatedData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeySafe,
                Amount: sum*100,
                OrderId: paymentId,
                Description: description,
                Password: this.passwordSafe
            };

            const bodyData: {
                StartSpAccumulation?: boolean;
                SpAccumulationId?: string
            } = {

            };

            if (accumulationId) {
                bodyData.SpAccumulationId = accumulationId;
            } else {
                bodyData.StartSpAccumulation = true;
            }
            
            const response = await this.transport.post('/Init', {
                ...body,
                DATA: bodyData,
                Token: this.signRequest(body)
            });

            const data = response.data;

            if (data.Status == 'REJECTED'  || !data.Success) {
                throw new Error(data.Message + " " + data.Details);
            }

            return Result.ok({
                amount: {
                    currency: currency,
                    value: data.Amount / 100
                },
                confirmation: {
                    confirmation_url: data.PaymentURL,
                    type: 'redirect'
                },
                created_at: new Date(),
                description: description,
                id: data.PaymentId,
                metadata: {
                    id: paymentId
                },
                paid: false,
                recipient: {
                    account_id: '',
                    gateway_id: ''
                },
                refundable: true,
                status: data.Status,
                test: true
            });
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async initPaymentSafe(sum: number, currency: string, paymentId: string, accumulationId: string, cardId: string): Promise<Result<IPaymentCreatedData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeySafeETC,
                Amount: sum*100,
                OrderId: paymentId,
                CardId: cardId,
                //Password: this.passwordSafe,
                DATA: `SpAccumulationId=${accumulationId}`
            };

            const requestSigned = await this.signRequestCryptoPro(body);
            if (requestSigned.isFailure) {
                throw requestSigned.getError();
            }

            const signatures = requestSigned.getValue()!;

            const urlencodedData: {[key: string]: string | number} = {};
            
            urlencodedData['TerminalKey'] = body.TerminalKey;
            urlencodedData['Amount'] = body.Amount;
            urlencodedData['OrderId'] = body.OrderId;
            urlencodedData['CardId'] = body.CardId;
            //urlencodedData['Password'] = body.Password;

            urlencodedData['DigestValue'] = signatures.DigestValue;
            urlencodedData['SignatureValue'] = signatures.SignatureValue;
            urlencodedData['X509SerialNumber'] = signatures.X509SerialNumber;
            urlencodedData['DATA'] = `SpAccumulationId=${accumulationId}`;

            const urlencoded = Object.entries(urlencodedData).map(([k, v]) => `${k}=${v}`).join('&');

            const response = await this.etcTransport.post('/Init', urlencoded, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });

            console.log(response);

            const { data } = response;

            if (data.Status == 'REJECTED'  || !data.Success) {
                throw new Error(data.Message + " " + data.Details);
            }

            return Result.ok({
                amount: {
                    currency: currency,
                    value: data.Amount / 100
                },
                confirmation: {
                    confirmation_url: data.PaymentURL,
                    type: 'redirect'
                },
                created_at: new Date(),
                description: '',
                id: data.PaymentId,
                metadata: {
                    id: paymentId
                },
                paid: false,
                recipient: {
                    account_id: '',
                    gateway_id: ''
                },
                refundable: true,
                status: data.Status,
                test: true
            })
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async confirmPaymentSafe(paymentId: string): Promise<Result<IPaymentConfirmedData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: this.apiKeySafeETC,
                PaymentId: paymentId
            };

            const requestSigned = await this.signRequestCryptoPro(body);
            if (requestSigned.isFailure) {
                throw requestSigned.getError();
            }

            const signatures = requestSigned.getValue()!;

            const urlencodedData: {[key: string]: string | number} = {};
            
            urlencodedData['TerminalKey'] = body.TerminalKey;
            urlencodedData['PaymentId'] = body.PaymentId;

            urlencodedData['DigestValue'] = signatures.DigestValue;
            urlencodedData['SignatureValue'] = signatures.SignatureValue;
            urlencodedData['X509SerialNumber'] = signatures.X509SerialNumber;

            const urlencoded = Object.entries(urlencodedData).map(([k, v]) => `${k}=${v}`).join('&');

            const response = await this.etcTransport.post('/Payment', urlencoded, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });

            console.log(response);

            const { data } = response;

            if (data.Status == 'REJECTED'  || !data.Success) {
                throw new Error(data.Message + " " + data.Details);
            }

            return Result.ok({
                ErrorCode: data.ErrorCode,
                Mesage: data.Message,
                OrderId: data.OrderId,
                PaymentId: data.PaymentId,
                Status: data.PaymentId,
                Success: data.Success,
                TerminalKey: data.TerminalKey
            });
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async cancelPayment(paymentId: string, amount: number, type: TerminalType): Promise<Result<IPaymentCanceledData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: type == 'default' ? this.apiKeyDefault : (type == 'split' ? this.apiKeySplit : this.apiKeySafe),
                PaymentId: paymentId,
                Password: type == 'default' ? this.passwordDefault : (type == 'split' ? this.passwordSplit : this.passwordSafe),
                Amount: amount
            };

            const token = this.signRequest(body);

            const response = await this.transport.post('/Cancel', {
                ...body,
                Token: token
            });

            const { data } = response;

            if (!data.Success && data.NewAmount != 0) {
                throw new Error(data.Message || 'Error upon canceling payment');
            }

            return Result.ok({
                TerminalKey: data.TerminalKey,
                ErrorCode: data.ErrorCode,
                Message: data.Message,
                NewAmount: data.NewAmount,
                OrderId: data.OrderId,
                OriginalAmount: data.OriginalAmount,
                PaymentId: data.PaymentId,
                Status: data.Status,
                Success: data.Success
            });
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(ex);
        }
    }

    public async checkPaymentConfirmed(paymentId: string, type: TerminalType): Promise<Result<boolean | null, Error | null>> {
        try {
            console.log(paymentId, type);

            const body = {
                TerminalKey: type == 'default' ? this.apiKeyDefault : (type == 'split' ? this.apiKeySplit : this.apiKeySafe),
                PaymentId: paymentId,
                Password: type == 'default' ? this.passwordDefault : (type == 'split' ? this.passwordSplit : this.passwordSafe),
            };

            const token = this.signRequest(body);

            const response = await this.transport.post('/GetState', {
                ...body,
                Token: token
            });

            console.log(response);

            const { data } = response; 

            if (data.Status && data.Status == this.successfulStatus) {
                return Result.ok(true);
            } else if (data.Status && data.Status != this.successfulStatus) {
                return Result.ok(false);
            } else {
                return Result.fail(new Error('Cannot get payment status'));
            }
        } catch (ex) {
            return Result.fail(ex);
        }
    }

    public validateNotification(_: string): boolean {
        return true;
    };

    private signRequest(body: any): string {
        console.log(body);
        const arr = this.convertObjectToSortedArray(body);
        console.log(arr);
        const str = this.convertArrayToString(arr);

        const hash = crypto.createHash('sha256').update(str).digest('hex');
        return hash;
    }

    private convertArrayToString(arr: any[]): string {
        return arr.reduce((p, c) => p + (<any>Object.values(c))[0], '');
    }

    private convertObjectToSortedArray(obj: {[key: string]: any}): any[] {
        let arr = [];
        for (const key in obj) {
            arr.push({[key]: obj[key]});
        }

        return arr.sort((a: any, b: any) => Object.keys(a)[0][0] > Object.keys(b)[0][0] ? 1 : -1);
    }

    private configureTransport(baseUrl: string) {
        return axios.create({
            baseURL: baseUrl
        });
    }

    public async resendNotifications(type: TerminalType): Promise<Result<INotificationsResentData | null, Error | null>> {
        try {
            const body = {
                TerminalKey: type == 'default' ? this.apiKeyDefault : (type == 'split' ? this.apiKeySplit : this.apiKeySafe),
                Password: type == 'default' ? this.passwordDefault : (type == 'split' ? this.passwordSplit : this.passwordSafe)
            };

            const { data } = await (type == 'default' ? this.transport : this.splitTransport).post('/Resend', {
                ...body,
                Token: this.signRequest(body)
            });
            if (!data.Success) {
                console.log(data);
                return Result.fail(new Error(data.Message));
            }

            return Result.ok({...data});
        } catch (ex) {
            console.log(ex);
            logger.error(ex.stack, ex.message);
            return Result.fail(new Error('Error upon resending notifications'));
        }
    }

    public async createShop(body: IRegistrationData): Promise<Result<IShopCreatedData | null, Error | null>> {
        try {
            console.log(body);
            const accessTokenRenewed = await this.renewToken();
            if (accessTokenRenewed.isFailure) {
                return Result.fail(new Error('Error upon token renewal'));
            }

            const response = await this.registrationTransport.post('/register', {
                ...body
            }, {
                headers: {
                    'Authorization': 'Bearer' + this.accessToken.value
                }
            });
            
            return Result.ok({
                code: response.data.code,
                shopCode: response.data.shopCode,
                terminals: response.data.terminals
            });
        } catch (ex) {
            console.log(ex.response.data);
            logger.error(ex.stack, JSON.stringify(ex.message));
            return Result.fail(new Error(ex.response.data.message));
        }
    }

    private async auth(): Promise<Result<string | null, Error | null>> {
        try {
            const formData = new FormData();

            formData.append('grant_type', 'password');
            formData.append('username', this.userName);
            formData.append('password', this.userPassword);

            console.log(formData);

            const {data: {access_token, expires_in}} = await this.registrationTransport.post('/oauth/token', formData, {
                auth: {
                    password: 'partner',
                    username: 'partner'
                },
                headers: {
                    ...formData.getHeaders()
                }
            });

            const date = new Date();

            this.accessToken = {
                expirationDate: new Date(expires_in + date.getTime()),
                value: access_token
            };

            return Result.ok(access_token);
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            return Result.fail(new Error('Error upon authorization attempt'));
        }
    }

    private async renewToken(): Promise<Result<string | null, Error | null>> {
        const expired = this.accessToken.expirationDate.getTime() < new Date().getTime();
        if (expired) {
            const accessTokenRenewed = await this.auth();
            if (accessTokenRenewed.isFailure) {
                return Result.fail(accessTokenRenewed.getError()!);
            }

            const accessToken = accessTokenRenewed.getValue()!;
            return Result.ok(accessToken);
        }
        
        return Result.ok(this.accessToken.value);
    }

    private async signRequestCryptoPro(body: any): Promise<Result<ISignResponse | null, Error | null>> {
        try {
            console.log(body);

            const { data } = await this.signTransport.post(`/get.php?token=${this.signKey}`, {
                hashFields: body
            });

            console.log(data);

            if (!data.status) {
                throw new Error('Ooops');
            }

            return Result.ok(data.data);
        } catch (ex) {
            console.log(ex);
            logger.error(ex.stack, ex.message);
            return Result.fail(new Error('Error upon signing request'));
        }
    }
}