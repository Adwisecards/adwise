import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IEventListenerService } from "../../../../global/services/eventListenerService/IEventListenerService";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { DeleteCouponFromContactDTO } from "./DeleteCouponFromContactDTO";
import { deleteCouponFromContactErrors } from "./deleteCouponFromContactErrors";

export class DeleteCouponFromContactUseCase implements IUseCase<DeleteCouponFromContactDTO.Request, DeleteCouponFromContactDTO.Response> {
    private couponRepo: ICouponRepo;
    private contactRepo: IContactRepo;
    private eventListenerService: IEventListenerService;

    public errors: UseCaseError[] = [
        ...deleteCouponFromContactErrors
    ];

    constructor(couponRepo: ICouponRepo, contactRepo: IContactRepo, eventListenerService: IEventListenerService) {
        this.contactRepo = contactRepo;
        this.couponRepo = couponRepo;
        this.eventListenerService = eventListenerService;
    }

    public async execute(req: DeleteCouponFromContactDTO.Request): Promise<DeleteCouponFromContactDTO.Response> {
        if (!Types.ObjectId.isValid(req.contactId) || !Types.ObjectId.isValid(req.couponId)) {
            return Result.fail(UseCaseError.create('c', 'Coupon ID and contact ID must be valid'));
        }

        const couponFound = await this.couponRepo.findById(req.couponId);
        if (couponFound.isFailure) {
            return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('q'));
        }

        const coupon = couponFound.getValue()!

        const contactFound = await this.contactRepo.findById(req.contactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('w'));
        }

        const contact = contactFound.getValue()!;

        const couponIndex = contact.coupons.findIndex(c => c.toHexString() == req.couponId);

        if (couponIndex < 0) {
            return Result.fail(UseCaseError.create('b'));
        }

        contact.coupons.splice(couponIndex, 1);

        const contactSaved = await this.contactRepo.save(contact);
        if (contactSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving contact'));
        }

        this.eventListenerService.dispatchEvent({
            id: contact.ref.toString(),
            subject: coupon._id.toString(),
            type: 'couponRemoved'
        });

        return Result.ok({couponId: coupon._id});
    }
}