import { VersionModel } from "../../models/Version";
import { VersionRepo } from "./implementation/VersionRepo";

export const versionRepo = new VersionRepo(VersionModel);