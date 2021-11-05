import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IPacketSoldRecord } from "../../models/PacketSoldRecord";

export interface IPacketSoldRecordRepo extends IRepo<IPacketSoldRecord> {
    findByPacketIdAndOrganization(packetId: string, organizationId: string): RepoResult<IPacketSoldRecord>;
};