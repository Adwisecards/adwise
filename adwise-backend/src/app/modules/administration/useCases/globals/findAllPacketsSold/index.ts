import { currencyService } from "../../../../../services/currencyService";
import { wisewinService } from "../../../../../services/wisewinService";
import { xlsxService } from "../../../../../services/xlsxService";
import { packetSoldRecordRepo } from "../../../../finance/repo/packetSoldRecords";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { walletRepo } from "../../../../finance/repo/wallets";
import { packetRepo } from "../../../../organizations/repo/packets";
import { userRepo } from "../../../../users/repo/users";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllPacketsSoldController } from "./FindAllPacketsSoldController";
import { FindAllPacketsSoldUseCase } from "./FindAllPacketsSoldUseCase";

const findAllPacketsSoldUseCase = new FindAllPacketsSoldUseCase(userRepo, xlsxService, transactionRepo, administrationValidationService, packetRepo, walletRepo, currencyService, wisewinService, packetSoldRecordRepo);
const findAllPacketsSoldController = new FindAllPacketsSoldController(findAllPacketsSoldUseCase);

export {
    findAllPacketsSoldUseCase,
    findAllPacketsSoldController
};