import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IClient } from "../../../models/Client";
import { FavoriteOrganizationListModel, IFavoriteOrganizationList } from "../../../models/FavoriteOrganizationList";
import { IOrganization } from "../../../models/Organization";
import { IClientRepo } from "../../../repo/clients/IClientRepo";
import { IFavoriteOrganizationListRepo } from "../../../repo/favoriteOrganizationLists/IFavoriteOrganizationListRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IFavoriteOrganizationListValidationService } from "../../../services/favoriteOrganizationLists/favoriteOrganizationListValidationService/IFavoriteOrganizationListValidationService";
import { AddOrganizationToUserFavoriteListDTO } from "./AddOrganizationToUserFavoriteListDTO";
import { addOrganizationToUserFavoriteListErrors } from "./addOrganizationToUserFavoriteListErrors";

interface IKeyObjects {
    user: IUser;
    client?: IClient;
    organization: IOrganization;
    favoriteOrganizationList: IFavoriteOrganizationList;
};

export class AddOrganizationToUserFavoriteListUseCase implements IUseCase<AddOrganizationToUserFavoriteListDTO.Request, AddOrganizationToUserFavoriteListDTO.Response> {
    private userRepo: IUserRepo;
    private clientRepo: IClientRepo;
    private organizationRepo: IOrganizationRepo;
    private favoriteOrganizationListRepo: IFavoriteOrganizationListRepo;
    private favoriteOrganizationListValidationService: IFavoriteOrganizationListValidationService;

    public errors = addOrganizationToUserFavoriteListErrors;

    constructor(
        userRepo: IUserRepo,
        clientRepo: IClientRepo,
        organizationRepo: IOrganizationRepo,
        favoriteOrganizationListRepo: IFavoriteOrganizationListRepo,
        favoriteOrganizationListValidationService: IFavoriteOrganizationListValidationService
    ) {
        this.userRepo = userRepo;
        this.clientRepo = clientRepo;
        this.organizationRepo = organizationRepo;
        this.favoriteOrganizationListRepo = favoriteOrganizationListRepo;
        this.favoriteOrganizationListValidationService = favoriteOrganizationListValidationService;
    }

    public async execute(req: AddOrganizationToUserFavoriteListDTO.Request): Promise<AddOrganizationToUserFavoriteListDTO.Response> {
        const valid = this.favoriteOrganizationListValidationService.addOrganizationToUserFavoriteListData(req);
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
            user,
            client
        } = keyObjectsGotten.getValue()!;

        if (!client || client.disabled) {
            return Result.fail(UseCaseError.create('c', 'User is not organization client'));
        }

        const organizationIndex = favoriteOrganizationList.organizations.findIndex(o => o.toString() == organization._id.toString());
        if (organizationIndex != -1) {
            return Result.fail(UseCaseError.create('f', 'Organization is already in user favorite list'));
        }

        favoriteOrganizationList.organizations.push(organization._id);

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

        let client: IClient | undefined;

        const clientFound = await this.clientRepo.findByOrganizationAndUser(organizationId, userId);
        if (clientFound.isFailure && clientFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding clinet'));
        }

        if (clientFound.isSuccess) {
            client = clientFound.getValue()!;
        }

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
            user,
            client
        });
    }
}