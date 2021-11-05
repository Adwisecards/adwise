import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserTreeNode, UserTreeNode } from "../../../models/UserTreeNode";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserValidationService } from "../../../services/userValidationService/IUserValidationService";
import { GetUserTreeChildrenDTO } from "./GetUserTreeChildrenDTO";
import { getUserTreeChildrenErrors } from "./getUserTreeChildrenErrors";

export class GetUserTreeChildrenUseCase implements IUseCase<GetUserTreeChildrenDTO.Request, GetUserTreeChildrenDTO.Response> {
    private userRepo: IUserRepo;
    private userValidationService: IUserValidationService;

    public errors = getUserTreeChildrenErrors;

    constructor(
        userRepo: IUserRepo,
        userValidationService: IUserValidationService
    ) {
        this.userRepo = userRepo;
        this.userValidationService = userValidationService;
    }

    public async execute(req: GetUserTreeChildrenDTO.Request): Promise<GetUserTreeChildrenDTO.Response> {
        const valid = this.userValidationService.getUserTreeChildrenData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const userChildrenFound = await this.userRepo.findByParent(user._id.toString());
        if (userChildrenFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user children'));
        }

        const userNode = new UserTreeNode(user, []);

        const userChildren: IUserTreeNode[] = userChildrenFound.getValue()!.map(c => {
            return {
                children: [],
                user: c,
                parent: {...userNode}
            };
        });

        userNode.children = userChildren;

        return Result.ok({userTree: userNode});
    }
}