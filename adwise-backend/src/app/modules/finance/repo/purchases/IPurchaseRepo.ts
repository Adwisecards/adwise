import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IPurchase } from "../../models/Purchase";

export interface IPurchaseRepo extends IRepo<IPurchase> {
    findByUserAndOrganization(user: string, organization: string): RepoResult<IPurchase[]>;
    findByOrganization(organizationId: string, limit: number, page: number, confirmed?: boolean, dateFrom?: string, dateTo?: string, sortBy?: string, order?: number, archived?: boolean): RepoResult<IPurchase[]>;
    findByUser(userId: string, limit: number, page: number, all?: boolean): RepoResult<IPurchase[]>;
    findByOrganizationAndConfirmed(organizationId: string, limit: number, page: number): RepoResult<IPurchase[]>;
    findByCashierAndComplete(cashierId: string, complete: boolean): RepoResult<IPurchase[]>;
    findManyByPurchasersAndOrganization(purchaserIds: string[], organizationId: string): RepoResult<IPurchase[]>;
    findByPurchaserIdsAndOrganizationAndConfirmed(purchaserIds: string[], organizationId: string, confirmed: boolean): RepoResult<IPurchase[]>;
    findManyByDateRangeAndConfirmed(dateFrom: Date, dateTo: Date, confirmed: boolean): RepoResult<IPurchase[]>;
    findByUserAndFilter(userId: string, limit: number, page: number, filter: Record<string, boolean>[], dateFrom?: string, dateTo?: string, refCode?: string, organizationName?: string): RepoResult<IPurchase[]>;
    countByUserAndFilter(userId: string, filter: Record<string, boolean>[], dateFrom?: string, dateTo?: string, refCode?: string, organizationName?: string): RepoResult<number>;
    findByOrganizationAndFilter(organizationId: string, limit: number, page: number, filter: Record<string, boolean>[], dateFrom?: string, dateTo?: string, sortBy?: string, order?: number, refCode?: string, cashierContactId?: string, purchaserContactId?: string): RepoResult<IPurchase[]>;
    countByOrganizationAndFilter(organizationId: string, filter: Record<string, boolean>[], dateFrom?: string, dateTo?: string, refCode?: string, cashierContactId?: string, purchaserContactId?: String): RepoResult<number>;
    setManyArchivedByOrganizationAndConfirmedAndComplete(organizationId: string, confirmed: boolean, complete: boolean, archived: boolean): RepoResult<any>;
    setManyArchivedByOrganization(organizationId: string, archived: boolean): RepoResult<any>;
    findManyByCoupons(couponIds: string[]): RepoResult<IPurchase[]>;
};