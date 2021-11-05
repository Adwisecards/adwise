import MyRegexp from "myregexp";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWisewinService } from "../../../../../services/wisewinService/IWisewinService";
import { IEmployeeRepo } from "../../../../organizations/repo/employees/IEmployeeRepo";
import { IUser } from "../../../models/User";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IAuthService } from "../../../services/authService/IAuthService";
import { IUserValidationService } from "../../../services/userValidationService/IUserValidationService";
import { SignInDTO } from "./SignInDTO";
import { signInErrors } from "./signInErrors";

export class SignInUseCase implements IUseCase<SignInDTO.Request, SignInDTO.Response> {
    private userRepo: IUserRepo;
    private userValidationService: IUserValidationService;
    private authService: IAuthService;
    private employeeRepo: IEmployeeRepo;
    public errors: UseCaseError[] = [
        ...signInErrors
    ];
    constructor(userRepo: IUserRepo, userValidationService: IUserValidationService, authService: IAuthService, employeeRepo: IEmployeeRepo) {
        this.userRepo = userRepo;
        this.userValidationService = userValidationService;
        this.authService = authService;
        this.employeeRepo = employeeRepo;
    }

    public async execute(req: SignInDTO.Request): Promise<SignInDTO.Response> {
        const valid = this.userValidationService.signInData<SignInDTO.Request>(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }
        let user: IUser;

        const loginIsPhone = MyRegexp.phone().test(req.login);
        if (loginIsPhone) {
            const userFound = await this.userRepo.findByPhone(req.login);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('g'));
            }

            user = userFound.getValue()!;
        } else {
            const userFound = await this.userRepo.findByEmail(req.login);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('g'));
            }

            user = userFound.getValue()!;
        }

        const passwordIsValid = await user.comparePassword(req.password);
        if (!passwordIsValid) {
            return Result.fail(UseCaseError.create('h'));
        }

        if (!user.verified) {
            return Result.fail(UseCaseError.create('c', 'User is not verified'));
        }

        if (req.isCashier) {
            const employeeFound = await this.employeeRepo.findByUserAndDisabledAndRole(user._id, false, 'cashier');
            if (employeeFound.isFailure) {
                return Result.fail(employeeFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('d', 'User is not cashier'));
            }
        }

        // if (!req.isCrm && !req.isCashier) {
        //     if (user.organization) {
        //         return Result.fail(UseCaseError.create('d', 'Cannot sign in from CRM'))
        //     }
        // }

        if (req.isCrm) {
            if (!user.organization) {
                return Result.fail(UseCaseError.create('d', 'Cannot sign in from client app'));
            }
        }

        if (req.language) {
            user.language = req.language;

            const userSaved = await this.userRepo.save(user);
            if (userSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
            }
        }

        if (req.pushNotificationsEnabled) {
            user.pushNotificationsEnabled = req.pushNotificationsEnabled;

            const userSaved = await this.userRepo.save(user);
            if (userSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
            }
        }
 
        if (req.pushToken) {
            const userWithPushTokenFound = await this.userRepo.findByPushToken(req.pushToken);
            if (userWithPushTokenFound.isSuccess) {
                const userWithPushToken = userWithPushTokenFound.getValue()!;
                userWithPushToken.pushToken = '';

                await this.userRepo.save(userWithPushToken);
            }

            user.pushToken = req.pushToken;
            const userSaved = await this.userRepo.save(user);
            if (userSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
            }
        }

        if (req.pushTokenBusiness) {
            const userWithPushTokenBusinessFound = await this.userRepo.findByPushTokenBusiness(req.pushTokenBusiness);
            if (userWithPushTokenBusinessFound.isSuccess) {
                const userWithPushToken = userWithPushTokenBusinessFound.getValue()!;
                userWithPushToken.pushTokenBusiness = '';

                await this.userRepo.save(userWithPushToken);
            }

            user.pushTokenBusiness = req.pushTokenBusiness;
            const userSaved = await this.userRepo.save(user);
            if (userSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
            }
        }

        if (req.deviceToken) {
            const userWithDeviceTokenFound = await this.userRepo.findByDeviceToken(req.deviceToken);
            if (userWithDeviceTokenFound.isSuccess) {
                const userWithDeviceToken = userWithDeviceTokenFound.getValue()!;
                userWithDeviceToken.deviceToken = '';

                await this.userRepo.save(userWithDeviceToken);
            }

            user.deviceToken = req.deviceToken;
            const userSaved = await this.userRepo.save(user);
            if (userSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
            }
        }

        if (req.deviceTokenBusiness) {
            const userWithDeviceTokenFound = await this.userRepo.findByDeviceTokenBusiness(req.deviceTokenBusiness);
            if (userWithDeviceTokenFound.isSuccess) {
                const userWithDeviceToken = userWithDeviceTokenFound.getValue()!;
                userWithDeviceToken.deviceTokenBusiness = '';

                await this.userRepo.save(userWithDeviceToken);
            }

            user.deviceTokenBusiness = req.deviceTokenBusiness;
            const userSaved = await this.userRepo.save(user);
            if (userSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
            }
        }
        
        const jwtCreated = await this.authService.sign({
            userId: user._id,
            admin: user.admin,
            adminGuest: user.adminGuest
        });
        if (jwtCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon signing jwt'));
        }

        const jwt = jwtCreated.getValue()!;

        return Result.ok({userId: user._id, jwt: jwt});
    }
}
