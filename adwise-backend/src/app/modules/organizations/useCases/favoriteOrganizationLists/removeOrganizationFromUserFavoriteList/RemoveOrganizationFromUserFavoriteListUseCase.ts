import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { FavoriteOrganizationListModel, IFavoriteOrganizationList } from "../../../models/FavoriteOrganizationList";
import { IOrganization } from "../../../models/Organization";
import { IFavoriteOrganizationListRepo } from "../../../repo/favoriteOrganizationLists/IFavoriteOrganizationListRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IFavoriteOrganizationListValidationService } from "../../../services/favoriteOrganizationLists/favoriteOrganizationListValidationService/IFavoriteOrganizationListValidationService";
import { RemoveOrganizationFromUserFavoriteListDTO } from "./RemoveOrganizationFromUserFavoriteListDTO";
import { removeOrganizationFromUserFavoriteListErrors } from "./removeOrganizationFromUserFavoriteListErrors";

interface IKeyObjects {
    user: IUser;
    organization: IOrganization;
    favoriteOrganizationList: IFavoriteOrganizationList;
};

export class RemoveOrganizationFromUserFavoriteListUseCase implements IUseCase<RemoveOrganizationFromUserFavoriteListDTO.Request, RemoveOrganizationFromUserFavoriteListDTO.Response> {
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private favoriteOrganizationListRepo: IFavoriteOrganizationListRepo;
    private favoriteOrganizationListValidationService: IFavoriteOrganizationListValidationService;

    public errors = removeOrganizationFromUserFavoriteListErrors;

    constructor(
        userRepo: IUserRepo,
        organizationRepo: IOrganizationRepo,
        favoriteOrganizationListRepo: IFavoriteOrganizationListRepo,
        favoriteOrganizationListValidationService: IFavoriteOrganizationListValidationService
    ) {
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.favoriteOrganizationListRepo = favoriteOrganizationListRepo;
        this.favoriteOrganizationListValidationService = favoriteOrganizationListValidationService;
    }

    public async execute(req: RemoveOrganizationFromUserFavoriteListDTO.Request): Promise<RemoveOrganizationFromUserFavoriteListDTO.Response> {
        const valid = this.favoriteOrganizationListValidationService.removeOrganizationFromUserFavoriteListData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.organizationId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            favoriteOrganizationList,
            organization,
            user
        } = keyObjectsGotten.getValue()!;

        const organizationIndex = favoriteOrganizationList.organizations.findIndex(o => o.toString() == organization._id.toString());
        if (organizationIndex == -1) {
            return Result.fail(UseCaseError.create('l', 'Organization is not in user favorite list'));
        }

        favoriteOrganizationList.organizations.splice(organizationIndex, 1);

        const favoriteOrganizationListSaved = await this.favoriteOrganizationListRepo.save(favoriteOrganizationList);
        if (favoriteOrganizationListSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving favorite organization list'));
        }

        return Result.ok({
            organizationId: req.organizationId
        });
    }

    private async getKeyObjects(userId: string, organizationId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding user") : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let favoriteOrganizationList: IFavoriteOrganizationList;

        const favoriteOrganizationListFound = await this.favoriteOrganizationListRepo.findByUser(userId);
        if (favoriteOrganizationListFound.isFailure && favoriteOrganizationListFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding favorite organization list'));
        }
        
        if (favoriteOrganizationListFound.isFailure && favoriteOrganizationListFound.getError()!.code == 404) {
            favoriteOrganizationList = new FavoriteOrganizationListModel({
                user: userId,
                organizations: []
            });
        } else {
            favoriteOrganizationList = favoriteOrganizationListFound.getValue()!;
        }

        return Result.ok({
            favoriteOrganizationList,
            organization,
            user
        });
    }
}