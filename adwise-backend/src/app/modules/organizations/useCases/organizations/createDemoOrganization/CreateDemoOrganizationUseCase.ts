import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IPurchase } from "../../../../finance/models/Purchase";
import { ConfirmPurchaseUseCase } from "../../../../finance/useCases/purchases/confirmPurchase/ConfirmPurchaseUseCase";
import { CreatePurchaseUseCase } from "../../../../finance/useCases/purchases/createPurchase/CreatePurchaseUseCase";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { CreateUserUseCase } from "../../../../users/useCases/users/createUser/CreateUserUseCase";
import { ICoupon } from "../../../models/Coupon";
import { IOrganization } from "../../../models/Organization";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { CreateCategoryUseCase } from "../../categories/createCategory/CreateCategoryUseCase";
import { AddCouponToContactUseCase } from "../../coupons/addCouponToContact/AddCouponToContactUseCase";
import { CreateCouponDTO } from "../../coupons/createCoupon/CreateCouponDTO";
import { CreateCouponUseCase } from "../../coupons/createCoupon/CreateCouponUseCase";
import { CreateOrganizationUseCase } from "../createOrganization/CreateOrganizationUseCase";
import { SubscribeToOrganizationUseCase } from "../subscribeToOrganization/SubscribeToOrganizationUseCase";
import { CreateDemoOrganizationDTO } from "./CreateDemoOrganizationDTO";
import { createDemoOrganizationErrors } from "./createDemoOrganizationErrors";
import { CreateUserDTO } from "../../../../users/useCases/users/createUser/CreateUserDTO";
import faker from 'faker';
import MyRegexp from "myregexp";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import * as uuid from 'uuid';
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { SetOrganizationPacketUseCase } from "../../packets/setOrganizationPacket/SetOrganizationPacketUseCase";
import { SetManagerUseCase } from "../setManager/SetManagerUseCase";
import { SetCouponDisabledUseCase } from "../../coupons/setCouponDisabled/SetCouponDisabledUseCase";
import { configProps } from "../../../../../services/config";
import { UpdateOrganizationStatisticsUseCase } from "../../organizationStatistics/updateOrganizationStatistics/UpdateOrganizationStatisticsUseCase";
import { CreatePacketUseCase } from "../../packets/createPacket/CreatePacketUseCase";
import { SetOrganizationGlobalUseCase } from "../../../../administration/useCases/globals/setOrganizationGlobal/SetOrganizationGlobalUseCase";
import { CreateMediaUseCase } from "../../../../media/useCases/createMedia/CreateMediaUseCase";
import { CreateAddressFromCoordsUseCase } from "../../../../maps/useCases/addresses/createAddressFromCoords/CreateAddressFromCoordsUseCase";
import { CreateCouponCategoryUseCase } from "../../couponCategories/createCouponCategory/CreateCouponCategoryUseCase";
import { IWallet } from "../../../../finance/models/Wallet";
import { ITransaction } from "../../../../finance/models/Transaction";
import { IOrganizationFinancialStatisticsFigures } from "../../../services/organizations/organizationStatisticsService/IOrganizationStatisticsService";

faker.locale = 'ru';

interface IFirstStepObjects {
    organizationUser: IUser;
    organization: IOrganization;
    coupons: ICoupon[];
};

interface ISecondStepObjects {
    subscriberUsers: IUser[];
};

interface IThirdStepObjects {
    purchases: IPurchase[];
};

interface IFourthStepObjects {
    purchaserWallet: IWallet;
    organizationWallet: IWallet;
    organizationFinancialStatistics: IOrganizationFinancialStatisticsFigures;
    transactions: ITransaction[];
};

export class CreateDemoOrganizationUseCase implements IUseCase<CreateDemoOrganizationDTO.Request, CreateDemoOrganizationDTO.Response> {
    private userRepo: IUserRepo;
    private couponRepo: ICouponRepo;
    private packetRepo: IPacketRepo;
    private purchaseRepo: IPurchaseRepo;
    private organizationRepo: IOrganizationRepo;
    private setManagerUseCase: SetManagerUseCase;
    private createUserUseCase: CreateUserUseCase;
    private createMediaUseCase: CreateMediaUseCase;
    private createPacketUseCase: CreatePacketUseCase;
    private createCouponUseCase: CreateCouponUseCase;
    private createCategoryUseCase: CreateCategoryUseCase;
    private createPurchaseUseCase: CreatePurchaseUseCase;
    private confirmPurchaseUseCase: ConfirmPurchaseUseCase;
    private setCouponDisabledUseCase: SetCouponDisabledUseCase;
    private addCouponToContactUseCase: AddCouponToContactUseCase;
    private createOrganizationUseCase: CreateOrganizationUseCase;
    private createCouponCategoryUseCase: CreateCouponCategoryUseCase;
    private setOrganizationGlobalUseCase: SetOrganizationGlobalUseCase;
    private setOrganizationPacketUseCase: SetOrganizationPacketUseCase;
    private subscribeToOrganizationUseCase: SubscribeToOrganizationUseCase;
    private createAddressFromCoordsUseCase: CreateAddressFromCoordsUseCase;
    private updateOrganizationStatisticsUseCase: UpdateOrganizationStatisticsUseCase;

    public errors = createDemoOrganizationErrors;

    constructor(
        userRepo: IUserRepo,
        couponRepo: ICouponRepo,
        packetRepo: IPacketRepo,
        purchaseRepo: IPurchaseRepo,
        organizationRepo: IOrganizationRepo,
        setManagerUseCase: SetManagerUseCase,
        createUserUseCase: CreateUserUseCase,
        createMediaUseCase: CreateMediaUseCase,
        createPacketUseCase: CreatePacketUseCase,
        createCouponUseCase: CreateCouponUseCase,
        createCategoryUseCase: CreateCategoryUseCase,
        createPurchaseUseCase: CreatePurchaseUseCase,
        confirmPurchaseUseCase: ConfirmPurchaseUseCase,
        setCouponDisabledUseCase: SetCouponDisabledUseCase,
        addCouponToContactUseCase: AddCouponToContactUseCase,
        createOrganizationUseCase: CreateOrganizationUseCase,
        createCouponCategoryUseCase: CreateCouponCategoryUseCase,
        setOrganizationGlobalUseCase: SetOrganizationGlobalUseCase,
        setOrganizationPacketUseCase: SetOrganizationPacketUseCase,
        subscribeToOrganizationUseCase: SubscribeToOrganizationUseCase,
        createAddressFromCoordsUseCase: CreateAddressFromCoordsUseCase,
        updateOrganizationStatisticsUseCase: UpdateOrganizationStatisticsUseCase
    ) {
        this.userRepo = userRepo;
        this.couponRepo = couponRepo;
        this.packetRepo = packetRepo;
        this.purchaseRepo = purchaseRepo;
        this.organizationRepo = organizationRepo;
        this.setManagerUseCase = setManagerUseCase;
        this.createUserUseCase = createUserUseCase;
        this.createMediaUseCase = createMediaUseCase;
        this.createPacketUseCase = createPacketUseCase;
        this.createCouponUseCase = createCouponUseCase;
        this.createCategoryUseCase = createCategoryUseCase;
        this.createPurchaseUseCase = createPurchaseUseCase;
        this.confirmPurchaseUseCase = confirmPurchaseUseCase;
        this.setCouponDisabledUseCase = setCouponDisabledUseCase;
        this.addCouponToContactUseCase = addCouponToContactUseCase;
        this.createOrganizationUseCase = createOrganizationUseCase;
        this.createCouponCategoryUseCase = createCouponCategoryUseCase;
        this.setOrganizationGlobalUseCase = setOrganizationGlobalUseCase;
        this.setOrganizationPacketUseCase = setOrganizationPacketUseCase;
        this.subscribeToOrganizationUseCase = subscribeToOrganizationUseCase;
        this.createAddressFromCoordsUseCase = createAddressFromCoordsUseCase;
        this.updateOrganizationStatisticsUseCase = updateOrganizationStatisticsUseCase;
    }

    public async execute(_: CreateDemoOrganizationDTO.Request): Promise<CreateDemoOrganizationDTO.Response> {
        if (!configProps.demo) {
            return Result.fail(UseCaseError.create('c', 'Demo organization cannot be created in this environment'));
        }
        
        const firstStepExecuted = await this.firstStep();
        if (firstStepExecuted.isFailure) {
            return Result.fail(firstStepExecuted.getError());
        }

        const {
            coupons,
            organization,
            organizationUser
        } = firstStepExecuted.getValue()!;

        const secondStepExecuted = await this.secondStep(organization);
        if (secondStepExecuted.isFailure) {
            return Result.fail(secondStepExecuted.getError());
        }

        const {
            subscriberUsers
        } = secondStepExecuted.getValue()!;

        const thirdStepExecuted = await this.thirdStep(subscriberUsers, coupons, organization);
        if (thirdStepExecuted.isFailure) {
            return Result.fail(thirdStepExecuted.getError());
        }

        const {
            purchases
        } = thirdStepExecuted.getValue()!;

        const fourthStepExecuted = await this.fourthStep(organization._id);
        if (fourthStepExecuted.isFailure) {
            return Result.fail(fourthStepExecuted.getError());
        }

        return Result.ok({organizationId: organization._id});   
    }

    private async fourthStep(organizationId: string): Promise<Result<true | null, UseCaseError | null>> {
        const organizationFinancialStatisticsUpdated = await this.updateOrganizationStatisticsUseCase.execute({
            organizationId: organizationId.toString()
        });

        if (organizationFinancialStatisticsUpdated.isFailure) {
            return Result.fail(organizationFinancialStatisticsUpdated.getError()!);
        }

        return Result.ok(true);
    }

    private async thirdStep(subscriberUsers: IUser[], coupons: ICoupon[], organization: IOrganization): Promise<Result<IThirdStepObjects | null, UseCaseError | null>> {
        const purchaseIds: string[] = [];

        for (const subscriberUser of subscriberUsers.slice()) {
            const couponIndex = Math.floor((Math.random() * (coupons.length-1 - 0) - 0));
            
            const coupon = coupons[couponIndex];

            const couponAddedToContact = await this.addCouponToContactUseCase.execute({
                contactId: subscriberUser.contacts[0].toString(),
                couponId: coupon._id.toString()
            });

            if (couponAddedToContact.isFailure) {
                return Result.fail(couponAddedToContact.getError());
            }

            const purchaseCreated = await this.createPurchaseUseCase.execute({
                cashierContactId: organization.defaultCashier.toString(),
                coupons: [{couponId: coupon._id.toString(), count: 1}],
                description: 'Покупка из приложения',
                purchaserContactId: subscriberUser.contacts[0].toString(),
                userId: subscriberUser._id.toString()
            });

            if (purchaseCreated.isFailure) {
                return Result.fail(purchaseCreated.getError());
            }


            const { purchaseId } = purchaseCreated.getValue()!;

            const purchaseConfirmed = await this.confirmPurchaseUseCase.execute({
                purchaseId: purchaseId.toString()
            });

            if (purchaseConfirmed.isFailure) {
                return Result.fail(purchaseConfirmed.getError());
            }

            purchaseIds.push(purchaseId);
        }

        const purchasesFound = await this.purchaseRepo.findByIds(purchaseIds);
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const purchases = purchasesFound.getValue()!;

        return Result.ok({purchases});
    }

    private async secondStep(organization: IOrganization): Promise<Result<ISecondStepObjects | null, UseCaseError | null>> {       
        const userIds: string[] = [];
        
        for (let i = 0; i < 20; i++) {
            const userData: CreateUserDTO.Request = {
                email: undefined as any,
                dob: undefined as any,
                firstName: faker.name.firstName(),
                gender: Math.random() > 0.5 ? 'female' : 'male',
                noCheck: true,
                noVerification: true,
                organizationUser: true,
                password: '123123123',
                phone: '7'+(faker.phone.phoneNumber()).replace(MyRegexp.phoneFormat(), ''),
                lastName: faker.name.lastName(),
                parentRefCode: undefined as any
            };

            const userCreated = await this.createUserUseCase.execute(userData);
            if (userCreated.isFailure) {
                return Result.fail(userCreated.getError()!);
            }

            if (userCreated.isFailure) {
                return Result.fail(userCreated.getError());
            }

            const { userId } = userCreated.getValue()!;
        
            userIds.push(userId);
        }

        const usersFound = await this.userRepo.findByIds(userIds);
        if (usersFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding users'));
        }

        const users = usersFound.getValue()!;

        for (const user of users) {
            const subscribedToOrganization = await this.subscribeToOrganizationUseCase.execute({
                contactId: user.contacts[0].toString(),
                organizationId: organization._id.toString(),
                userId: user._id.toString(),
                followingUserId: undefined as any,
                invitationId: undefined as any
            });

            if (subscribedToOrganization.isFailure) {
                return Result.fail(subscribedToOrganization.getError());
            }
        }

        return Result.ok({subscriberUsers: users});
    }

    private async firstStep(): Promise<Result<IFirstStepObjects | null, UseCaseError | null>> {
        const userCreated = await this.createUserUseCase.execute({
            email: 'demouser@adwise.cards',
            dob: '2000-03-20',
            firstName: 'Демо',
            gender: 'female',
            noCheck: true,
            noVerification: true,
            organizationUser: true,
            password: '123123123',
            phone: undefined as any,
            lastName: undefined as any,
            parentRefCode: undefined as any
        });

        if (userCreated.isFailure) {
            return Result.fail(userCreated.getError());
        }

        const addressCreated = await this.createAddressFromCoordsUseCase.execute({
            lat: 56.83610369209932,
            long: 60.61449836127701
        });

        if (addressCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating address'));
        }

        const { address } = addressCreated.getValue()!;

        const { userId } = userCreated.getValue()!;
        
        const categoryCreated = await this.createCategoryUseCase.execute({
            name: 'Демо категория #'+uuid.v4()
        });

        if (categoryCreated.isFailure) {
            return Result.fail(categoryCreated.getError());
        }

        const { categoryId } = categoryCreated.getValue()!;
        
        const organizationCreated = await this.createOrganizationUseCase.execute({
            name: 'Демо организация',
            briefDescription: 'Делаем дела',
            cashback: 10,
            categoryId: categoryId.toString(),
            description: 'Демо описание, бла бла бла бла бла бла бла бла',
            distributionSchema: {
                first: 10,
                other: 10
            },
            emails: ['email1@adwise.cards', 'email2@adwise.cards'],
            phones: ['79915144011'],
            addressId: address._id.toString(),
            colors: {
                primary: '#fff',
                secondary: '#fff'
            },
            tags: ['демо', 'демонстрация', 'ещё один тег'],
            userId: userId.toString(),
            mainPictureMediaId: undefined as any,
            pictureMediaId: undefined as any,
            schedule: undefined as any,
            socialMedia: undefined as any,
            requestedPacketId: undefined as any
        });

        if (organizationCreated.isFailure) {
            return Result.fail(organizationCreated.getError());
        }

        const { organizationId } = organizationCreated.getValue()!;

        const organizationSetGlobal = await this.setOrganizationGlobalUseCase.execute({organizationId: organizationId.toString()});
        if (organizationSetGlobal.isFailure) {
            return Result.fail(organizationSetGlobal.getError()!);
        }

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        organization.signed = true;
        organization.disabled = false;
        organization.demo = true;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        user.wisewinId = '57610';

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        const managerSet = await this.setManagerUseCase.execute({
            organizationId: organizationId.toString(),
            userManagerRefCode: user.ref.code
        });

        if (managerSet.isFailure) {
            return Result.fail(managerSet.getError());
        }

        const packetsFound = await this.packetRepo.findAll(false);
        if (packetsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding packets'));
        }

        const packets = packetsFound.getValue()!;

        if (!packets.length) {
            const packetCreated = await this.createPacketUseCase.execute({
                currency: 'rub',
                limit: 1000,
                managerReward: 20,
                name: 'business',
                price: 10000,
                refBonus: 5,
                period: 12,
                wisewinOption: false
            });

            if (packetCreated.isFailure) {
                return Result.fail(packetCreated.getError());
            }

            const { packetId } = packetCreated.getValue()!;

            const packetFound = await this.packetRepo.findById(packetId.toString());
            if (packetFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding packet'));
            } 

            const packet = packetFound.getValue()!;

            packets.push(packet);
        }

        const biggestPacket = packets.sort((a, b) => a.limit < b.limit ? 1 : -1)[0];

        const organizationPacketSet = await this.setOrganizationPacketUseCase.execute({
            date: new Date().toISOString(),
            noRecord: false,
            organizationId: organizationId.toString(),
            packetId: biggestPacket._id.toString()
        });

        if (organizationPacketSet.isFailure) {
            return Result.fail(organizationPacketSet.getError()!);
        }

        const couponCategoryCreated = await this.createCouponCategoryUseCase.execute({
            name: 'Демо категория',
            organizationId: organization._id.toString(),
            userId: user._id.toString()
        });

        if (couponCategoryCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating coupon category'));
        }

        const { couponCategoryId } = couponCategoryCreated.getValue()!;

        const date = new Date();

        const startDate = date;

        const endDate = date;

        startDate.setDate(date.getDate() - 1);
        endDate.setDate(date.getDate() + 7);

        const couponDataSet: CreateCouponDTO.Request[] = [
            {
                description: 'Описание купона №1',
                distributionSchema: {
                    first: 10,
                    other: 10
                },
                endDate: endDate.toISOString(),
                index: 0,
                locationAddressId: address._id.toString(),
                name: 'Купон №1',
                offerPercent: 10,
                offerType: 'cashback',
                offerPoints: undefined as any,
                organizationId: organizationId.toString(),
                price: 100,
                quantity: 100,
                startDate: startDate.toISOString(),
                type: 'service',
                userId: user._id.toString(),
                documentMediaId: undefined as any,
                pictureMediaId: undefined as any,
                termsDocumentMediaId: undefined as any,
                couponCategoryIds: [couponCategoryId]
            },
            {
                description: 'Описание купона №2',
                distributionSchema: {
                    first: 10,
                    other: 10
                },
                endDate: endDate.toISOString(),
                index: 0,
                locationAddressId: address._id.toString(),
                name: 'Купон №2',
                offerPercent: 10,
                offerType: 'cashback',
                offerPoints: undefined as any,
                organizationId: organizationId.toString(),
                price: 60,
                quantity: 100,
                startDate: startDate.toISOString(),
                type: 'service',
                userId: user._id.toString(),
                documentMediaId: undefined as any,
                pictureMediaId: undefined as any,
                termsDocumentMediaId: undefined as any,
                couponCategoryIds: [couponCategoryId]
            },
            {
                description: 'Описание купона №3',
                distributionSchema: {
                    first: 10,
                    other: 10
                },
                endDate: endDate.toISOString(),
                index: 0,
                locationAddressId: address._id.toString(),
                name: 'Купон 3',
                offerPercent: 10,
                offerType: 'cashback',
                offerPoints: undefined as any,
                organizationId: organizationId.toString(),
                price: 100,
                quantity: 100,
                startDate: startDate.toISOString(),
                type: 'service',
                userId: user._id.toString(),
                documentMediaId: undefined as any,
                pictureMediaId: undefined as any,
                termsDocumentMediaId: undefined as any,
                couponCategoryIds: [couponCategoryId]
            }
        ];

        const couponIds: string[] = [];

        for (const couponData of couponDataSet) {
            const couponCreated = await this.createCouponUseCase.execute(couponData);
            if (couponCreated.isFailure) {
                return Result.fail(couponCreated.getError())
            }

            const { couponId } = couponCreated.getValue()!;

            couponIds.push(couponId);
        }
        
        const couponsFound = await this.couponRepo.findByIds(couponIds);
        if (couponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding users'));
        }

        const coupons = couponsFound.getValue()!;

        return Result.ok({
            coupons,
            organization,
            organizationUser: user
        });
    }
}