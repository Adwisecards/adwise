import { LogModel } from "../models/Log";
import { LogRepo } from "./implementation/LogRepo";

export const logRepo = new LogRepo(LogModel);