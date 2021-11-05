import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../models/User";
import { IUserTreeNode, UserTreeNode } from "../../../models/UserTreeNode";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserValidationService } from "../../../services/userValidationService/IUserValidationService";
import { GetUserTreeDTO } from "./GetUserTreeDTO";
import { getUserTreeErrors } from "./getUserTreeErrors";

export class GetUserTreeUseCase implements IUseCase<GetUserTreeDTO.Request, GetUserTreeDTO.Response> {
    private userRepo: IUserRepo;
    private userValidationService: IUserValidationService;

    public errors = getUserTreeErrors;

    constructor(
        userRepo: IUserRepo,
        userValidationService: IUserValidationService
    ) {
        this.userRepo = userRepo;
        this.userValidationService = userValidationService;
    }

    public async execute(req: GetUserTreeDTO.Request): Promise<GetUserTreeDTO.Response> {
        const valid = this.userValidationService.getUserTree(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        let nodes: IUser[] | null = [user];

        let cur = user;

        while (cur.parent) {
            const parentFound = await this.userRepo.findById(cur.parent.toString());
            if (parentFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding parent'));
            }

            const parent = parentFound.getValue()!;

            nodes.unshift(parent);

            cur = parent;
        }

        // const childrenFound = await this.userRepo.findByParent(node._id.toString());
        // if (childrenFound.isFailure) {
        //     return Result.fail(UseCaseError.create('a', 'Error upon finding children'));
        // }

        // const children = childrenFound.getValue()!;
        
        let prevNode: IUserTreeNode | undefined;


        for (const node of nodes) {

            const childrenFound = await this.userRepo.findByParent(node._id.toString());
            if (childrenFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding children'));
            }

            const children: IUserTreeNode[] = childrenFound.getValue()!.map(c => {
                return new UserTreeNode(c, []);
            });

            const userTreeNode = new UserTreeNode(node, children);

            if (prevNode) {
                userTreeNode.parent = prevNode;
            }

            prevNode = userTreeNode;
        }

        return Result.ok({userTree: prevNode!});
    }
}