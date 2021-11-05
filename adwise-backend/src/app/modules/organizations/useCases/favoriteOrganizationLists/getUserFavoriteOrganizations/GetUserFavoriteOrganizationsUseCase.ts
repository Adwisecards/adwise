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
import { GetUserFavoriteOrganizationsDTO } from "./GetUserFavoriteOrganizationsDTO";
import { getUserFavoriteOrganizationsErrors } from "./getUserFavoriteOrganizationsErrors";

interface IKeyObjects {
    user: IUser;
    organizations: IOrganization[];
    favoriteOrganizationList: IFavoriteOrganizationList;
};

export class GetUserFavoriteOrganizationsUseCase implements IUseCase<GetUserFavoriteOrganizationsDTO.Request, GetUserFavoriteOrganizationsDTO.Response> {
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private favoriteOrganizationListRepo: IFavoriteOrganizationListRepo;
    private favoriteOrganizationListValidationService: IFavoriteOrganizationListValidationService;

    public errors = getUserFavoriteOrganizationsErrors;

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

    public async execute(req: GetUserFavoriteOrganizationsDTO.Request): Promise<GetUserFavoriteOrganizationsDTO.Response> {
        const valid = this.favoriteOrganizationListValidationService.getUserFavoriteOrganizationsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('a', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            favoriteOrganizationList,
            organizations,
            user
        } = keyObjectsGotten.getValue()!;

        return Result.ok({
            organizations
        });
    }

    private async getKeyObjects(userId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding user") : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

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

        const organizationIds = favoriteOrganizationList.organizations.map(o => o.toString());

        const organizationsFound = await this.organizationRepo.findByIds(organizationIds);
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const organizations = organizationsFound.getValue()!;

        return Result.ok({
            favoriteOrganizationList,
            organizations,
            user
        });
    }
}