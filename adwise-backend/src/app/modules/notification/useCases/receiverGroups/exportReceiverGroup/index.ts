import { xlsxService } from "../../../../../services/xlsxService";
import { userRepo } from "../../../../users/repo/users";
import { receiverGroupRepo } from "../../../repo/receiverGroups";
import { ExportReceiverGroupController } from "./ExportReceiverGroupController";
import { ExportReceiverGroupUseCase } from "./ExportReceiverGroupUseCase";

export const exportReceiverGroupUseCase = new ExportReceiverGroupUseCase(userRepo, xlsxService, receiverGroupRepo);
export const exportReceiverGroupController = new ExportReceiverGroupController(exportReceiverGroupUseCase);