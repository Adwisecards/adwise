import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { ILegal } from "../../../models/Legal";
import { ILegalRepo } from "../../../repo/legal/ILegalRepo";
import { BindPaymentShopIdsToLegalsDTO } from "./BindPaymentShopIdsToLegalsDTO";
import { bindPaymentShopIdsToLegalsErrors } from "./bindPaymentShopIdsToLegalsErrors";

interface IKeyObjects {
    organizations: IOrganization[];
    legals: ILegal[];
};

export class BindPaymentShopIdsToLegalsUseCase implements IUseCase<BindPaymentShopIdsToLegalsDTO.Request, BindPaymentShopIdsToLegalsDTO.Response> {
    private legalRepo: ILegalRepo;
    private organizationRepo: IOrganizationRepo;

    public errors = bindPaymentShopIdsToLegalsErrors;

    constructor(
        legalRepo: ILegalRepo,
        organizationRepo: IOrganizationRepo
    ) {
        this.legalRepo = legalRepo;
        this.organizationRepo = organizationRepo;
    }

    public async execute(_: BindPaymentShopIdsToLegalsDTO.Request): Promise<BindPaymentShopIdsToLegalsDTO.Response> {
        const keyObjectsGotten = await this.getKeyObjects();
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            legals,
            organizations
        } = keyObjectsGotten.getValue()!;

        const legalIds: string[] = [];

        for (const legal of legals) {
            const result = await this.bindPaymentShopIdToLegal(legal, organizations);
            if (result.isSuccess) {
                const id = result.getValue()!;

                legalIds.push(id);
            }
        }

        return Result.ok({legalIds});
    }

    private async bindPaymentShopIdToLegal(legal: ILegal, organizations: IOrganization[]): Promise<Result<string | null, UseCaseError | null>> {
        const organization = organizations.find(o => o._id.toString() == legal.organization.toString());
        if (!organization) {
            return Result.fail(UseCaseError.create('a', 'No organization'));
        }

        legal.paymentShopId = organization.paymentShopId;
        organization.paymentShopId = undefined as any;

        const legalSaved = await this.legalRepo.save(legal);
        if (legalSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving legal'));
        }

        await this.organizationRepo.save(organization);

        return Result.ok(legal._id.toString());
    }

    private async getKeyObjects(): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const organizationsFound = await this.organizationRepo.getAll();
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const organizations = organizationsFound.getValue()!.filter(o => !!o.paymentShopId);

        const organizationIds = organizations.map(o => o._id.toString());

        const legalsFound = await this.legalRepo.findManyByOrganizations(organizationIds);
        if (legalsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding legals'));
        }

        const legals = legalsFound.getValue()!.filter(l => !l.paymentShopId);

        return Result.ok({
            legals,
            organizations
        });
    }
}