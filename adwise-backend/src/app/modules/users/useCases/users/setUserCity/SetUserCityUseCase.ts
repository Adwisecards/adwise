import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { GetOrganizationCitiesUseCase } from "../../../../organizations/useCases/organizations/getOrganizationCities/GetOrganizationCitiesUseCase";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserValidationService } from "../../../services/userValidationService/IUserValidationService";
import { SetUserCityDTO } from "./SetUserCityDTO";
import { setUserCityErrors } from "./setUserCityErrors";

export class SetUserCityUseCase implements IUseCase<SetUserCityDTO.Request, SetUserCityDTO.Response> {
    private userRepo: IUserRepo;
    private userValidationService: IUserValidationService;
    private getOrganizationCitiesUseCase: GetOrganizationCitiesUseCase;

    public errors = setUserCityErrors;

    constructor(
        userRepo: IUserRepo, 
        userValidationService: IUserValidationService,
        getOrganizationCitiesUseCase: GetOrganizationCitiesUseCase
    ) {
        this.userRepo = userRepo;
        this.userValidationService = userValidationService;
        this.getOrganizationCitiesUseCase = getOrganizationCitiesUseCase;
    }

    public async execute(req: SetUserCityDTO.Request): Promise<SetUserCityDTO.Response> {
        const valid = this.userValidationService.setUserCityData(req);

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        if (req.city) {
            const organizationCitiesGotten = await this.getOrganizationCitiesUseCase.execute({});
            if (organizationCitiesGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting organization cities'));
            }

            const { organizationCities } = organizationCitiesGotten.getValue()!;

            const organizationCityFound = !!organizationCities.find(c => c == req.city);

            if (!organizationCityFound) {
                return Result.fail(UseCaseError.create('c', 'City does not exist'));
            }
        }

        if (!user.address) {
            user.address = {
                city: req.city
            };
        } else {
            user.address.city = req.city;
        }

        if (!req.city) {
            user.address = undefined as any;
        }
        
        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({
            userId: user._id.toString()
        });
    }
}