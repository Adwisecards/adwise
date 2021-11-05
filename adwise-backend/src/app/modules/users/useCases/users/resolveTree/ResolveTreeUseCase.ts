import MyRegexp from "myregexp";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWisewinService } from "../../../../../services/wisewinService/IWisewinService";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { createUserUseCase } from "../createUser";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { SignInWithWisewinUseCase } from "../signInWithWisewin/SignInWithWisewinUseCase";
import { ResolveTreeDTO } from "./ResolveTreeDTO";
//import { resolveTreeErrors } from "./resolveTreeErrors";

export class ResolveTreeUseCase implements IUseCase<ResolveTreeDTO.Request, ResolveTreeDTO.Response> {
    private wisewinService: IWisewinService;
    private userRepo: IUserRepo;
    private signInWithWisewinUseCase: SignInWithWisewinUseCase; 
    public errors = [
        
    ];

    constructor(wisewinService: IWisewinService, userRepo: IUserRepo, signInWithWisewinUseCase: SignInWithWisewinUseCase) {
        this.wisewinService = wisewinService;
        this.userRepo = userRepo;
        this.signInWithWisewinUseCase = signInWithWisewinUseCase;
    }

    public async execute(req: ResolveTreeDTO.Request): Promise<ResolveTreeDTO.Response> {
        if (!req.wisewinParentId) {
            return Result.ok({user: req.user, wisewinParentId: req.wisewinParentId});
        }

        const wisewinUserFound = await this.wisewinService.getUser(req.wisewinParentId);
        if (wisewinUserFound.isFailure) {
            return Result.ok({user: req.user, wisewinParentId: req.wisewinParentId});
        }

        const wisewinUser = wisewinUserFound.getValue()!;
        
        let parentUserFound = await this.userRepo.findByEmail(wisewinUser.email);

        if (parentUserFound.isSuccess) {
            req.user.parent = parentUserFound.getValue()!._id;

            const userSaved = await this.userRepo.save(req.user);
            if (userSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
            }
            
            return Result.ok({user: req.user, wisewinParentId: req.wisewinParentId});
        }

        // Should we do this using signInWithWisewin ???
        
        // const userCreated = await createUserUseCase.execute({
        //     dob: undefined as any,
        //     email: wisewinUser.email,
        //     phone: undefined as any,
        //     firstName: wisewinUser.firstName,
        //     lastName: wisewinUser.lastName,
        //     gender: wisewinUser.gender,
        //     organizationUser: undefined as any,
        //     password: undefined as any,
        //     noVerification: true,
        //     noCheck: true,
        //     parentRefCode: undefined as any
        // });

        // if (userCreated.isFailure) {
        //     return Result.fail(UseCaseError.create('a', 'Error upon creating user'));
        // }

        // const userCreatedData = userCreated.getValue()!;

        const signedInWithWisewin = await this.signInWithWisewinUseCase.execute({
            authToken: undefined as any,
            ipAddress: undefined as any,
            wisewinId: wisewinUser.id
        });

        if (signedInWithWisewin.isFailure) {
            console.log(5435345);
            return Result.fail(UseCaseError.create('a', 'Error upon signing in with wisewin'));
        }

        const signedInWithWisewinData = signedInWithWisewin.getValue()!;

        const userFound = await this.userRepo.findById(signedInWithWisewinData.userId);
        if (userFound.isFailure) {
            console.log(123123);
            return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
        }

        const user = userFound.getValue()!;

        req.user.parent = user._id;

        const userSaved = await this.userRepo.save(req.user);
        if (userSaved.isFailure) {
            console.log(userSaved);
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({
            user: req.user,
            wisewinParentId: wisewinUser.parentId
        });
    }
}