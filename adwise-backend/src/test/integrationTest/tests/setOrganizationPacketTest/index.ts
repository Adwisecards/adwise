import { organizationRepo } from "../../../../app/modules/organizations/repo/organizations";
import { setOrganizationPacketUseCase } from "../../../../app/modules/organizations/useCases/packets/setOrganizationPacket";
import { SetOrganizationPacketTest } from "./SetOrganizationPacketTest";

export const setOrganizationPacketTest = new SetOrganizationPacketTest(
    organizationRepo,
    setOrganizationPacketUseCase
);