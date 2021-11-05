import { MediaModel } from "../models/Media";
import { MediaRepo } from "./implementation/MediaRepo";

export const mediaRepo = new MediaRepo(MediaModel);