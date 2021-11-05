import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IBackgroundService } from "../../../../../services/backgroundService/IBackgroundService";
import { ITelegramService } from "../../../../../services/telegramService/ITelegramService";
import { IWisewinService, IWisewinUser } from "../../../../../services/wisewinService/IWisewinService";
import { CreateContactUseCase } from "../../../../contacts/useCases/contacts/createContact/CreateContactUseCase";
import { CreateWalletUseCase } from "../../../../finance/useCases/wallets/createWallet/CreateWalletUseCase";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { IUser, UserModel } from "../../../models/User";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IAuthService } from "../../../services/authService/IAuthService";
import { IPasswordService } from "../../../services/passwordService/IPasswordService";
import { IUserValidationService } from "../../../services/userValidationService/IUserValidationService";
import { CreateVerificationUseCase } from "../../verifications/createVerification/CreateVerificationUseCase";
import { ResolveTreeUseCase } from "../resolveTree/ResolveTreeUseCase";
import { CreateUserDTO } from "./CreateUserDTO";
import { createUserErrors } from "./createUserErrors";

export class CreateUserUseCase implements IUseCase<CreateUserDTO.Request, CreateUserDTO.Response> {
    private userRepo: IUserRepo;
    private userValidationService: IUserValidationService;
    private createVerificationUseCase: CreateVerificationUseCase;
    private createContactUseCase: CreateContactUseCase;
    private authService: IAuthService;
    private passwordService: IPasswordService;
    private createWalletUseCase: CreateWalletUseCase;
    private createRefUseCase: CreateRefUseCase;
    private wisewinService: IWisewinService;
    private backgroundService: IBackgroundService;
    private resolveTreeUseCase: ResolveTreeUseCase;
    private telegramService: ITelegramService;

    public errors = createUserErrors;

    constructor(
        userRepo: IUserRepo, 
        userValidationService: IUserValidationService, 
        createVerificationUseCase: CreateVerificationUseCase, 
        authService: IAuthService, 
        createContactUseCase: CreateContactUseCase, 
        passwordService: IPasswordService, 
        createWalletUseCase: CreateWalletUseCase, 
        createRefUseCase: CreateRefUseCase, 
        wisewinService: IWisewinService, 
        backgroundService: IBackgroundService, 
        resolveTreeUseCase: ResolveTreeUseCase,
        telegramService: ITelegramService
    ) {
        this.userRepo = userRepo;
        this.userValidationService = userValidationService;
        this.createVerificationUseCase = createVerificationUseCase;
        this.authService = authService;
        this.createContactUseCase = createContactUseCase;
        this.passwordService = passwordService;
        this.createWalletUseCase = createWalletUseCase;
        this.createRefUseCase = createRefUseCase;
        this.wisewinService = wisewinService;
        this.backgroundService = backgroundService;
        this.resolveTreeUseCase = resolveTreeUseCase;
        this.telegramService = telegramService;
    }

    public async execute(req: CreateUserDTO.Request): Promise<CreateUserDTO.Response> {
        // Checking validity
        const valid = this.userValidationService.signUpData<CreateUserDTO.Request>(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        // Checking if there is any conflict
        if (!req.noCheck) {
            if (req.email) {
                // Checking if email exists
                const userFound = await this.userRepo.findByEmail(req.email);
                if (userFound.isSuccess) {
                    return Result.fail(UseCaseError.create('f', 'User with the email already exists'));
                }
            } else if (req.phone) {
                // Checking if phone exists
                const userFound = await this.userRepo.findByPhone(req.phone);
                if (userFound.isSuccess) {
                    return Result.fail(UseCaseError.create('f', 'User with the phone number already exists'));
                }
            }
        }

        const password = req.password || this.passwordService.generatePassword();

        let wisewinUser: IWisewinUser;

        if (req.wisewinId) {
            const wisewinUserFound = await this.wisewinService.getUser(req.wisewinId);
            if (wisewinUserFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding wisewin user'));
            }

            wisewinUser = wisewinUserFound.getValue()!;
        } else if (req.email) {
            const wisewinUserFound = await this.wisewinService.getUserByEmail(req.email);
            if (wisewinUserFound.isSuccess) {
                wisewinUser = wisewinUserFound.getValue()!;
            }
        }

        const user = new UserModel({
            firstName: req.firstName,
            lastName: req.lastName,
            password: password,
            dob: req.dob,
            gender: req.gender,
            [req.email ? 'email' : 'phone']: req.email ? req.email : req.phone,
            pictureMedia: req.pictureMediaId
        });

        if (wisewinUser!) {
            user.wisewinId = wisewinUser!.id;
        }

        const refCreated = await this.createRefUseCase.execute({
            ref: user._id,
            mode: 'user',
            type: 'ref'
        });

        if (refCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
        }

        const ref = refCreated.getValue()!;

        user.ref = ref;

        if (req.pushToken) {
            user.pushToken = req.pushToken;
        }

        if (req.deviceToken) {
            user.deviceToken = req.deviceToken;
        }

        const walletCreated = await this.createWalletUseCase.execute({
            currency: 'rub',
            userId: user._id.toString()
        });

        if (walletCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating wallet'));
        }

        const walletId = walletCreated.getValue()!.walletId;
        user.wallet = new Types.ObjectId(walletId);

        if (req.noVerification) {
            user.verified = true;
        }

        let parentUser: IUser | undefined;
        if (req.parentRefCode) {
            const parentUserFound = await this.userRepo.findByRefCode(req.parentRefCode);
            if (parentUserFound.isFailure) {
                return Result.fail(parentUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding parent user') : UseCaseError.create('m', 'Parent user does not exist'));
            }

            parentUser = parentUserFound.getValue()!;

            user.parent = parentUser._id;
        }

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            console.log(userSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        if (wisewinUser!) {
            this.backgroundService.runInBackground(() => {
                this.resolveTreeUseCase.execute({
                    user: user,
                    wisewinParentId: wisewinUser.parentId
                })
            });
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
        
        const contactSaved = await this.createContactUseCase.execute({
            userId: user._id.toString(),
            activity: undefined as any,
            description: undefined as any,
            email: undefined as any,
            fb: undefined as any,
            insta: undefined as any,
            firstName: undefined as any,
            lastName: undefined as any,
            phone: undefined as any,
            type: 'personal',
            vk: undefined as any,
            website: undefined as any,
            pictureFile: undefined as any,
            color: '#007BED',
            pictureMediaId: undefined as any
        });

        if (contactSaved.isFailure) {
            console.log(contactSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon creating contact'));
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

        if (user.phone) {
            await this.telegramService.send('userCreated', {
                userName: `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`,
                userPhone: user.phone,
                userId: user._id.toString(),
                parentName: parentUser ? `${parentUser.firstName}${parentUser.lastName ? ' ' + parentUser.lastName : ''}` : '-'
            });
        }

        if (!req.noVerification) {
            const verificationCreated = await this.createVerificationUseCase.execute({
                userId: user._id,
                password: password
            });
            if (verificationCreated.isFailure) {
                this.userRepo.deleteById(user._id);
                return Result.fail(verificationCreated.getError());
            }
    
            const verificationId = verificationCreated.getValue()!.verificationId;

            return Result.ok({
                userId: user._id,
                verificationId: verificationId,
                jwt: jwt
            });
        }

        return Result.ok({
            userId: user._id,
            verificationId: '',
            jwt: jwt
        });
    }
}