import { mediaService } from "../../../../../services/mediaService";
import { pdfService } from "../../../../../services/pdfService";
import { organizationRepo } from "../../../repo/organizations";
import { organizationStatisticsService } from "../../../services/organizations/organizationStatisticsService";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { GetOrganizationFinancialReportController } from "./GetOrganizationFinancialReportController";
import { GetOrganizationFinancialReportUseCase } from "./GetOrganizationFinancialReportUseCase";

export const getOrganizationFinancialReportUseCase = new GetOrganizationFinancialReportUseCase(
    pdfService,
    mediaService,
    organizationRepo,
    organizationValidationService,
    organizationStatisticsService
);

export const getOrganizationFinancialReportController = new GetOrganizationFinancialReportController(getOrganizationFinancialReportUseCase);