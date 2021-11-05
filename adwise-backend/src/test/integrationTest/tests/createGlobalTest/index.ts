import { globalRepo } from "../../../../app/modules/administration/repo/globals";
import { CreateGlobalTest } from "./CreateGlobalTest";

export const createGlobalTest = new CreateGlobalTest(
    globalRepo
);