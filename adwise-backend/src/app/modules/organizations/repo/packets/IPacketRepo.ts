import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IPacket } from "../../models/Packet";

export interface IPacketRepo extends IRepo<IPacket> {
    findWiseDefault(): RepoResult<IPacket>;
    findAll(all: boolean): RepoResult<IPacket[]>;
    findManyByWisewinOption(wisewinOption: boolean): RepoResult<IPacket[]>;
};