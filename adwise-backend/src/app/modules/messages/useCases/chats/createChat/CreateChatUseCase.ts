import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ChatModel, IChat } from "../../../models/Chat";
import { IChatRepo } from "../../../repo/chatRepo/IChatRepo";
import { IChatValidationService } from "../../../services/chats/chatValidationService/IChatValidationService";
import { CreateChatDTO } from "./CreateChatDTO";
import { createChatErrors } from "./createChatErrors";

interface IKeyObjects {
    fromUser: IUser;
    organization?: IOrganization;
    user?: IUser;
};

export class CreateChatUseCase implements IUseCase<CreateChatDTO.Request, CreateChatDTO.Response> {
    private chatRepo: IChatRepo;
    private userRepo: IUserRepo;
    private createRefUseCase: CreateRefUseCase;
    private organizationRepo: IOrganizationRepo;
    private chatValidationService: IChatValidationService;

    public errors = createChatErrors;

    constructor(
        chatRepo: IChatRepo,
        userRepo: IUserRepo,
        createRefUseCase: CreateRefUseCase,
        organizationRepo: IOrganizationRepo,
        chatValidationService: IChatValidationService
    ) {
        this.chatRepo = chatRepo;
        this.userRepo = userRepo;
        this.createRefUseCase = createRefUseCase;
        this.organizationRepo = organizationRepo;
        this.chatValidationService = chatValidationService;
    }

    public async execute(req: CreateChatDTO.Request): Promise<CreateChatDTO.Response> {
        const valid = this.chatValidationService.createChatData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.fromUserId, req.to?.id, req.to?.type);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            fromUser,
            organization,
            user
        } = keyObjectsGotten.getValue()!;

        let chat: IChat;

        if (organization) {
            chat = new ChatModel({
                from: {
                    type: 'user',
                    ref: fromUser._id
                },
                to: {
                    type: 'organization',
                    ref: organization._id
                },
                type: 'organization'
            } as IChat);
        } else if (user) {
            chat = new ChatModel({
                from: {
                    type: 'user',
                    ref: fromUser._id
                },
                to: {
                    type: 'user',
                    ref: user._id
                },
                type: 'user'
            } as IChat);
        }

        const refCreated = await this.createRefUseCase.execute({
            mode: 'chat',
            type: 'chat',
            ref: chat!._id.toString()
        });

        if (refCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
        }

        const ref = refCreated.getValue()!;

        chat!.ref = ref;

        const chatSaved = await this.chatRepo.save(chat!);
        if (chatSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving chat'));
        }

        return Result.ok({chatId: chat!._id});
    }

    private async getKeyObjects(fromUserId: string, toId: string, toType: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const fromUserFound = await this.userRepo.findById(fromUserId);
        if (fromUserFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
        }

        const fromUser = fromUserFound.getValue()!;

        let organization: IOrganization | undefined;
        if (toType == 'organization') {
            const organizationFound = await this.organizationRepo.findById(toId);
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            organization = organizationFound.getValue()!;
        }

        let user: IUser | undefined;
        if (toType == 'user') {
            const userFound = await this.userRepo.findById(toId);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
            }

            user = userFound.getValue()!;
        }

        return Result.ok({
            fromUser,
            organization,
            user 
        });
    }
}