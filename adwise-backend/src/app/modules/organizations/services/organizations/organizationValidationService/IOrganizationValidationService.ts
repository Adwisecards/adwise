import { Result } from "../../../../../core/models/Result";

export interface IOrganizationValidationService {
    createOrganizationData<T>(data: T): Result<string | null, string | null>;
    updateOrganizationData<T>(data: T): Result<string | null, string | null>;
    findOrganizationsData<T>(data: T): Result<string | null, string | null>;
    createOrganizationShopData<T>(data: T): Result<string | null, string | null>;
    getOrganizationClientsData<T>(data: T): Result<string | null, string | null>;
    getOrganizationPurchasesData<T>(data: T): Result<string | null, string | null>;
    getOrganizationOperationsData<T>(data: T): Result<string | null, string | null>;
    getOrganizationCouponsData<T>(data: T): Result<string | null, string | null>;
    sendEnrollmentRequestData<T>(data: T): Result<string | null, string | null>;
    getOrganizationFinancialReport<T>(data: T): Result<string | null, string | null>;
    getOrganizationDocumentsData<T>(data: T): Result<string | null, string | null>;
    requestPaymentTypeData<T>(data: T): Result<string | null, string | null>;
    increaseOrganizationDepositData<T>(data: T): Result<string | null, string | null>;
    setDemoOrganization<T>(data: T): Result<string | null, string | null>;
    requestLegalInfoUpdate<T>(data: T): Result<string | null, string | null>;
    setAddressCoordsData<T>(data: T): Result<string | null, string | null>;
    generateDocumentsData<T>(data: T): Result<string | null, string | null>;
    getContactOrganizationsData<T>(data: T): Result<string | null, string | null>;
};