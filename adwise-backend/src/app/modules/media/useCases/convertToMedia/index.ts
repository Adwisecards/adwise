import { mediaService } from "../../../../services/mediaService";
import { couponRepo } from "../../../organizations/repo/coupons";
import { organizationRepo } from "../../../organizations/repo/organizations";
import { createMediaUseCase } from "../createMedia";
import { ConvertToMediaUseCase } from "./ConvertToMediaUseCase";

export const convertToMediaUseCase = new ConvertToMediaUseCase(
    couponRepo,
    mediaService,
    organizationRepo,
    createMediaUseCase
);