import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IContact } from "../../../../app/modules/contacts/models/Contact";
import { IPurchase } from "../../../../app/modules/finance/models/Purchase";
import { IPurchaseRepo } from "../../../../app/modules/finance/repo/purchases/IPurchaseRepo";
import { CreatePurchaseUseCase } from "../../../../app/modules/finance/useCases/purchases/createPurchase/CreatePurchaseUseCase";
import { ICoupon } from "../../../../app/modules/organizations/models/Coupon";
import { IOrganization } from "../../../../app/modules/organizations/models/Organization";
import { IUser } from "../../../../app/modules/users/models/User";

interface ICreatePurchasesObjects {
    purchases: IPurchase[];
    coupons: ICoupon[];
};

export class CreatePurchasesTest {
    private purchaseRepo: IPurchaseRepo;
    private createPurchaseUseCase: CreatePurchaseUseCase;

    constructor(
        purchaseRepo: IPurchaseRepo,
        createPurchaseUseCase: CreatePurchaseUseCase
    ) {
        this.purchaseRepo = purchaseRepo;
        this.createPurchaseUseCase = createPurchaseUseCase;
    }

    public async execute(organization: IOrganization, coupons: ICoupon[], defaultCashierContact: IContact, clientUser: IUser, clientUserContact: IContact): Promise<Result<ICreatePurchasesObjects | null, UseCaseError | null>> {
        const purchases: IPurchase[] = [];
        
        for (const coupon of coupons) {
            const purchaseCreated = await this.createPurchaseUseCase.execute({
                cashierContactId: defaultCashierContact._id.toString(),
                coupons: [{
                    count: 1,
                    couponId: coupon._id.toString()
                }],
                description: 'description',
                purchaserContactId: clientUserContact._id.toString(),
                userId: clientUser._id.toString()
            });

            if (purchaseCreated.isFailure) {
                return Result.fail(purchaseCreated.getError());
            }

            const { purchaseId } = purchaseCreated.getValue()!;

            const purchaseFound = await this.purchaseRepo.findById(purchaseId);
            if (purchaseFound.isFailure) {
                return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s', 'Purchase does not exist'));
            }

            const purchase = purchaseFound.getValue()!;

            purchases.push(purchase);
        }

        for (const index in purchases) {
            const purchase = purchases[index];
            const coupon = coupons[index];

            if (!purchase.organization) {
                return Result.fail(UseCaseError.create('c', 'Purchase does not point to no organization'));
            }

            if (purchase.organization.toString() != organization._id.toString()) {
                return Result.fail(UseCaseError.create('c', 'Purchase pointing to incorrect organization'));
            }

            if (!purchase.user) {
                return Result.fail(UseCaseError.create('c', 'Purchase does not point to no user'));
            }

            if (purchase.user.toString() != clientUser._id.toString()) {
                return Result.fail(UseCaseError.create('c', 'Purchase pointing to incorrect user'));
            }

            if (!purchase.purchaser) {
                return Result.fail(UseCaseError.create('c', 'Purchase does not point to no purchaser'));
            }

            if (purchase.purchaser.toString() != clientUserContact._id.toString()) {
                return Result.fail(UseCaseError.create('c', 'Purchase pointing to incorrect contact'));
            }

            const couponExists = !!purchase.coupons.find(c => c._id.toString() == coupon._id.toString());

            if (!couponExists) {
                return Result.fail(UseCaseError.create('c', 'Purchase does not contain coupon'));
            }

            const offerExists = !!purchase.offers.find(o => o._id.toString() == coupon.offer.toString());

            if (!offerExists) {
                return Result.fail(UseCaseError.create('c', 'Purchase does not contain offer'));
            }

            if (purchase.sumInPoints != coupon.price) {
                return Result.fail(UseCaseError.create('c', 'Purchase sum is not correct'));
            }

            if (!purchase.cashier) {
                return Result.fail(UseCaseError.create('c', 'Purchase does not point to no cashier'));
            }

            if (purchase.cashier.toString() != defaultCashierContact._id.toString()) {
                return Result.fail(UseCaseError.create('c', 'Purchase pointing to incorrect cashier'));
            }
        }

        return Result.ok({coupons, purchases});
    }
}