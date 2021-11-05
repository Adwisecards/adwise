import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IChat } from "../../../models/Chat";
import { IMessage, MessageModel } from "../../../models/Message";
import { IChatRepo } from "../../../repo/chatRepo/IChatRepo";
import { IMessageRepo } from "../../../repo/messageRepo/IMessageRepo";
import { IMessageValidationService } from "../../../services/messages/messageValidationService/IMessageValidationService";
import { CreateMessageDTO } from "./CreateMessageDTO";
import { createMessageErrors } from "./createMessageErrors";

interface IKeyObjects {
    chat: IChat;
    fromUser: IUser;
    user?: IUser;
    organization?: IOrganization;
};

export class CreateMessageUseCase implements IUseCase<CreateMessageDTO.Request, CreateMessageDTO.Response> {
    private chatRepo: IChatRepo;
    private userRepo: IUserRepo;
    private messageRepo: IMessageRepo;
    private organizationRepo: IOrganizationRepo;
    private messageValidationService: IMessageValidationService;

    public errors = createMessageErrors;

    constructor(
        chatRepo: IChatRepo,
        userRepo: IUserRepo,
        messageRepo: IMessageRepo,
        organizationRepo: IOrganizationRepo,
        messageValidationService: IMessageValidationService
    ) {
        this.chatRepo = chatRepo;
        this.userRepo = userRepo;
        this.messageRepo = messageRepo;
        this.organizationRepo = organizationRepo;
        this.messageValidationService = messageValidationService;
    }

    public async execute(req: CreateMessageDTO.Request): Promise<CreateMessageDTO.Response> {
        const valid = this.messageValidationService.createMessageData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.fromUserId, req.chatId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            chat,
            fromUser,
            organization,
            user
        } = keyObjectsGotten.getValue()!;

        let message: IMessage;

        if (organization) {
            message = new MessageModel({
                from: {
                    type: 'user',
                    ref: fromUser._id.toString()
                },
                to: {
                    type: 'organization',
                    ref: organization._id.toString()
                },
                body: {
                    text: req.body.text,
                    media: req.body.media
                },
                context: chat._id.toString()
            });
        } else {
            message = new MessageModel({
                from: {
                    type: 'user',
                    ref: fromUser._id.toString()
                },
                to: {
                    type: 'user',
                    ref: user!._id.toString()
                },
                body: {
                    text: req.body.text,
                    media: req.body.media
                },
                context: chat._id.toString()
            });
        }

        const messageSaved = await this.messageRepo.save(message);
        if (messageSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving message'));
        }

        return Result.ok({
            chatId: chat._id.toString(),
            messageId: message._id.toString()
        });
    }

    private async getKeyObjects(fromUserId: string, chatId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const fromUserFound = await this.userRepo.findById(fromUserId);
        if (fromUserFound.isFailure) {
            return Result.fail(fromUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const fromUser = fromUserFound.getValue()!;

        const chatFound = await this.chatRepo.findById(chatId);
        if (chatFound.isFailure) {
            return Result.fail(chatFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding chat') : UseCaseError.create('a4'));
        }

        const chat = chatFound.getValue()!;
        
        let organization: IOrganization | undefined;

        if (chat.type == 'organization') {
            const organizationFound = await this.organizationRepo.findById(chat.to.ref.toString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            organization = organizationFound.getValue()!;
        }

        let user: IUser | undefined;

        if (chat.type == 'user') {
            const userFound = await this.userRepo.findById(chat.to.ref.toString());
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding user") : UseCaseError.create('m'));
            }

            user = userFound.getValue()!;
        }

        return Result.ok({
            chat,
            fromUser,
            organization,
            user
        });
    }
}