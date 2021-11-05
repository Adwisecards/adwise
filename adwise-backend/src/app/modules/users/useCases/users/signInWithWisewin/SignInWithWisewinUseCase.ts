import { Types } from "mongoose";
import MyRegexp from "myregexp";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWisewinService } from "../../../../../services/wisewinService/IWisewinService";
import { CreateContactUseCase } from "../../../../contacts/useCases/contacts/createContact/CreateContactUseCase";
import { CreateWalletUseCase } from "../../../../finance/useCases/wallets/createWallet/CreateWalletUseCase";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { IUser, UserModel } from "../../../models/User";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IAuthService } from "../../../services/authService/IAuthService";
import { ResolveTreeUseCase } from "../resolveTree/ResolveTreeUseCase";
import { SignInWithWisewinDTO } from "./SignInWithWisewinDTO";
import { signInWithWisewinErrors } from "./signInWithWisewinErrors";
import * as uuid from 'uuid';
import { resolveTreeUseCase } from "../resolveTree";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { createUserUseCase } from "../createUser";

export class SignInWithWisewinUseCase implements IUseCase<SignInWithWisewinDTO.Request, SignInWithWisewinDTO.Response> {
    private wisewinService: IWisewinService;
    private userRepo: IUserRepo;
    private authService: IAuthService;
    private createWalletUseCase: CreateWalletUseCase;
    private createRefUseCase: CreateRefUseCase;
    private createContactUseCase: CreateContactUseCase;
    private resolveTreeUseCase: ResolveTreeUseCase;
    private createUserUseCase: CreateUserUseCase;

    public errors: UseCaseError[] = [
      ...signInWithWisewinErrors  
    ];

    constructor(
        wisewinService: IWisewinService, 
        userRepo: IUserRepo, 
        authService: IAuthService, 
        createWalletUseCase: CreateWalletUseCase, 
        createRefUseCase: CreateRefUseCase, 
        createContactUseCase: CreateContactUseCase, 
        resolveTreeUseCase: ResolveTreeUseCase,
        createUserUseCase: CreateUserUseCase
    ) {
        this.userRepo = userRepo;
        this.wisewinService = wisewinService;
        this.authService = authService;
        this.createWalletUseCase = createWalletUseCase;
        this.createRefUseCase = createRefUseCase;
        this.createContactUseCase = createContactUseCase;
        this.resolveTreeUseCase = resolveTreeUseCase;
        this.createUserUseCase = createUserUseCase;
    }

    public async execute(req: SignInWithWisewinDTO.Request): Promise<SignInWithWisewinDTO.Response> {
        if (!req.authToken && !req.wisewinId) {
            return Result.fail(UseCaseError.create('c', 'Provided data is not valid'));
        }

        let wisewinUserId = '';

        if (req.authToken) {
            const authTokenChecked = await this.wisewinService.checkAuthToken(req.authToken, req.ipAddress);
            if (authTokenChecked.isFailure) {
                console.log(authTokenChecked);
                return Result.fail(UseCaseError.create('c', 'Token is either corrupted or invalid'));
            }

            const authTokenCheckResponse = authTokenChecked.getValue()!;
            wisewinUserId = authTokenCheckResponse.userId;
        }

        if (req.wisewinId) {
            wisewinUserId = req.wisewinId;
        }

        const wisewinUserFound = await this.wisewinService.getUser(wisewinUserId);
        if (wisewinUserFound.isFailure) {
            console.log(wisewinUserFound);
            return Result.fail(wisewinUserFound.getError()!.message == 'Not found' ? UseCaseError.create('m', 'Wisewin user does not exist') : UseCaseError.create('a', 'Internal error returned by wisewin service'));
        }

        const wisewinUser = wisewinUserFound.getValue()!;

        let userFound = await this.userRepo.findByEmail(wisewinUser.email);
        
        let user: IUser;
        if (userFound.isFailure) {
            if (userFound.getError()!.code == 500) {
                return Result.fail(UseCaseError.create('a', 'DB error occurred in process of user search'));
            }

            const userCreated = await createUserUseCase.execute({
                firstName: wisewinUser.firstName,
                lastName: wisewinUser.lastName,
                gender: wisewinUser.gender,
                wisewinId: wisewinUser.id.toString(),
                dob: wisewinUser.dob?.toISOString(),
                email: wisewinUser.email,
                pictureMediaId: undefined as any,
                password: uuid.v4(),
                noVerification: true,
                noCheck: undefined as any,
                organizationUser: undefined as any,
                parentRefCode: undefined as any,
                phone: undefined as any
            });

            if (userCreated.isFailure) {
                console.log(userCreated.getError());
                return Result.fail(UseCaseError.create('a', 'Error upon creating user'));
            }

            const { userId } = userCreated.getValue()!;

            userFound = await this.userRepo.findById(userId);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m', 'User does not exist'));
            }

            user = userFound.getValue()!;
        } else {
            user = userFound.getValue()!;

            if (!user.wisewinId) {
                user.wisewinId = wisewinUser.id;
                
                const userSaved = await this.userRepo.save(user);
                if (userSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
                }
            }
        }

        const jwtCreated = await this.authService.sign({
            userId: user!._id,
            admin: user!.admin,
            adminGuest: user.adminGuest
        });
        if (jwtCreated.isFailure) {
            console.log(jwtCreated);
            return Result.fail(UseCaseError.create('a', 'Error upon signing jwt'));
        }

        const jwt = jwtCreated.getValue()!; 

        return Result.ok({jwt, userId: user!._id});
    }
}