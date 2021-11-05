import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IPacketSoldRecord, IPacketSoldRecordModel } from "../../../models/PacketSoldRecord";
import { IPacketSoldRecordRepo } from "../IPacketSoldRecordRepo";

export class PacketSoldRecordRepo extends Repo<IPacketSoldRecord, IPacketSoldRecordModel> implements IPacketSoldRecordRepo {
    public async findByPacketIdAndOrganization(packetId: string, organizationId: string) {
        try {
            const packetSoldRecord = await this.Model.findOne({
                'packet._id': packetId,
                'organization._id': organizationId
            });

            if (!packetSoldRecord) {
                return Result.fail(new RepoError('Packet sold record does not exist', 404));
            }

            return Result.ok(packetSoldRecord);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}