import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IPacket, IPacketModel } from "../../../models/Packet";
import { IPacketRepo } from "../IPacketRepo";

export class PacketRepo extends Repo<IPacket, IPacketModel> implements IPacketRepo {
    public async findWiseDefault() {
        try {
            const packet = await this.Model.findOne({wiseDefault: true, disabled: false});
            if (!packet) {
                return Result.fail(new RepoError('Packet is not found', 404));
            }

            return Result.ok(packet);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findAll(all: boolean) {
        try {
            const query: any = {disabled: false};

            if (all) {
                delete query.disabled;
            }

            const packets = await this.Model.find(query);

            return Result.ok(packets);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByWisewinOption(wisewinOption: boolean) {
        try {
            const packets = await this.Model.find({wisewinOption});

            return Result.ok(packets);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}