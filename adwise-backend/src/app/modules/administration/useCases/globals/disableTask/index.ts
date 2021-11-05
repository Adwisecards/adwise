import { globalRepo } from "../../../repo/globals";
import { DisableTaskController } from "./DisableTaskController";
import { DisableTaskUseCase } from "./DisableTaskUseCase";

const disableTaskUseCase = new DisableTaskUseCase(globalRepo);
const disableTaskController = new DisableTaskController(disableTaskUseCase);

export {
    disableTaskUseCase,
    disableTaskController
};