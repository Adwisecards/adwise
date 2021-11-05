import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IPacket } from "../../../../app/modules/organizations/models/Packet";
import { IPacketRepo } from "../../../../app/modules/organizations/repo/packets/IPacketRepo";
import { CreatePacketDTO } from "../../../../app/modules/organizations/useCases/packets/createPacket/CreatePacketDTO";
import { CreatePacketUseCase } from "../../../../app/modules/organizations/useCases/packets/createPacket/CreatePacketUseCase";

interface ICreatePacketObjects {
    packet: IPacket;
};

export class CreatePacketTest {
    private packetRepo: IPacketRepo;
    private createPacketUseCase: CreatePacketUseCase;

    constructor(
        packetRepo: IPacketRepo,
        createPacketUseCase: CreatePacketUseCase
    ) {
        this.packetRepo = packetRepo;
        this.createPacketUseCase = createPacketUseCase;
    }

    public async execute(): Promise<Result<ICreatePacketObjects | null, UseCaseError | null>> {
        const packetData: CreatePacketDTO.Request = {
            currency: 'rub',
            limit: 999,
            managerReward: 100,
            refBonus: 10,
            name: 'packet',
            period: 12,
            price: 10000,
            wisewinOption: false
        };

        const packetCreated = await this.createPacketUseCase.execute(packetData);
        if (packetCreated.isFailure) {
            return Result.fail(packetCreated.getError());
        }

        const { packetId } = packetCreated.getValue()!;

        const packetFound = await this.packetRepo.findById(packetId);
        if (packetFound.isFailure) {
            return Result.fail(packetFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet') : UseCaseError.create('y'));
        }

        const packet = packetFound.getValue()!;

        if (packetData.currency != packet.currency) {
            return Result.fail(UseCaseError.create('c', 'Currency is not correct'));
        }

        if (packetData.limit != packet.limit) {
            return Result.fail(UseCaseError.create('c', 'Limit is not correct'));
        }

        if (packetData.managerReward != packet.managerReward) {
            return Result.fail(UseCaseError.create('c', 'Manager reward is not correct'));
        }

        if (packetData.name != packet.name) {
            return Result.fail(UseCaseError.create('c', 'Name is not correct'));
        }

        if (packetData.period != packet.period) {
            return Result.fail(UseCaseError.create('c', 'Period is not correct'));
        }

        if (packetData.price != packet.price) {
            return Result.fail(UseCaseError.create('c', 'Price is not correct'));
        }

        if (packetData.refBonus != packet.refBonus) {
            return Result.fail(UseCaseError.create('c', 'Ref bonus is not correct'));
        }

        if (packetData.wisewinOption != packet.wisewinOption) {
            return Result.fail(UseCaseError.create('c', 'Wisewin option is not correct'));
        }

        return Result.ok({packet});
    }
}