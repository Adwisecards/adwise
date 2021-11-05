import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IEventListenerService } from "../../../../global/services/eventListenerService/IEventListenerService";
import { IClientRepo } from "../../../repo/clients/IClientRepo";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { AddCouponToContactDTO } from "./AddCouponToContactDTO";
import { addCouponToContactErrors } from "./addCouponToContactErrors";

export class AddCouponToContactUseCase implements IUseCase<AddCouponToContactDTO.Request, AddCouponToContactDTO.Response> {
    private couponRepo: ICouponRepo;
    private contactRepo: IContactRepo;
    private eventListenerService: IEventListenerService;
    private organizationRepo: IOrganizationRepo;
    private clientRepo: IClientRepo;

    public errors: UseCaseError[] = [
        ...addCouponToContactErrors
    ];

    constructor(
        couponRepo: ICouponRepo, 
        contactRepo: IContactRepo, 
        eventListenerService: IEventListenerService,
        organizationRepo: IOrganizationRepo,
        clientRepo: IClientRepo
    ) {
        this.contactRepo = contactRepo;
        this.couponRepo = couponRepo;
        this.eventListenerService = eventListenerService;
        this.organizationRepo = organizationRepo;
        this.clientRepo = clientRepo;
    }

    public async execute(req: AddCouponToContactDTO.Request): Promise<AddCouponToContactDTO.Response> {
        if (!Types.ObjectId.isValid(req.couponId) || !Types.ObjectId.isValid(req.contactId)) {
            return Result.fail(UseCaseError.create('c', `ID's must be valid`));
        }

        const couponFound = await this.couponRepo.findById(req.couponId);
        if (couponFound.isFailure) {
            return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('q'));
        }

        const coupon = couponFound.getValue()!;

        if (coupon.disabled) {
            return Result.fail(UseCaseError.create('c', 'Coupon is disabled'));
        }

        const organizationFound = await this.organizationRepo.findById(coupon.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        if (organization.disabled) {
            return Result.fail(UseCaseError.create('c', 'Organization is disabled'));
        }
        
        const contactFound = await this.contactRepo.findById(req.contactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('w'));
        }

        const contact = contactFound.getValue()!;

        if (contact.coupons.findIndex(c => c.toHexString() == req.couponId) >= 0) {
            console.log('CONFLICT', 12312312)
            return Result.fail(UseCaseError.create('f'));
        }

        const clientFound = await this.clientRepo.findByOrganizationAndUser(organization._id.toString(), contact.ref.toString());
        if (clientFound.isFailure) {
            return Result.fail(UseCaseError.create('c', 'User is not a client'));
        }

        const client = clientFound.getValue()!;

        if (client.disabled) {
            return Result.fail(UseCaseError.create('c', 'User is not a client'));
        }

        contact.coupons.push(coupon._id);
        const contactSaved = await this.contactRepo.save(contact);
        if (contactSaved.isFailure) {
            console.log(contactSaved);
            return Result.fail(UseCaseError.create('a', 'Error upon saving contact'));
        }

        this.eventListenerService.dispatchEvent({
            id: contact.ref.toString(),
            subject: coupon._id.toString(),
            type: 'couponAdded'
        });

        return Result.ok({couponId: req.couponId});
    }
}