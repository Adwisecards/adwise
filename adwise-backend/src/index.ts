import { Types } from "mongoose";
import { App } from "./app/App";
import { createPacketSoldRecordsUseCase } from "./app/modules/finance/useCases/packetSoldRecords/createPacketSoldRecords";
import { fixMissingTransactionsUseCase } from "./app/modules/finance/useCases/purchases/fixMissingTransactions";
import { repointPurchasesUseCase } from "./app/modules/finance/useCases/purchases/repointPurchases";
import { bindWalletsUseCase } from "./app/modules/finance/useCases/wallets/bindWallets";
import { recalculateWalletBalanceUseCase } from "./app/modules/finance/useCases/wallets/recalculateWalletBalance";
import { repointDefaultCashierUseCase } from "./app/modules/organizations/useCases/employees/repointDefaultCashier";
import { repointOrganizationsToManagersUseCase } from "./app/modules/organizations/useCases/organizations/repointOrganizationsToManagers";
import { splitUsersUseCase } from "./app/modules/users/useCases/users/splitUsers";
import { logger } from "./app/services/logger";

import { paymentService } from "./app/services/paymentService";
import { walletService } from "./app/services/walletService";
import fs from 'fs';
import { updateOrganizationStatisticsUseCase } from "./app/modules/organizations/useCases/organizationStatistics/updateOrganizationStatistics";
import { resendNotificationsUseCase } from "./app/modules/finance/useCases/payments/resendNotifications";
import { transformRefsUseCase } from "./app/modules/ref/useCases/transformRefs";
import { transformPurchasesUseCase } from "./app/modules/finance/useCases/purchases/transformPurchases";
import { payAccumulatedPaymentsUseCase } from "./app/modules/finance/useCases/accumulations/payAccumulatedPayments";
import { updateUserFinancialStatisticsUseCase } from "./app/modules/users/useCases/userFinancialStatistics/updateUserFinancialStatistics";
import cluster from 'cluster';
import os from 'os';
import { configProps } from "./app/services/config";
import { config } from "dotenv/types";
import { normalizePurchasesUseCase } from "./app/modules/finance/useCases/purchases/normalizePurchases";
import { checkIncorrectPurchasesUseCase } from "./app/modules/finance/useCases/purchases/checkIncorrectPurchases";
import { checkPaymentsUseCase } from "./app/modules/finance/useCases/payments/checkPayments";
import { createDemoOrganizationUseCase } from "./app/modules/organizations/useCases/organizations/createDemoOrganization";
import { findTransactionsContextUseCase } from "./app/modules/finance/useCases/transactions/findTransactionsContext";
import { unfreezeTransactionsUseCase } from "./app/modules/finance/useCases/transactions/unfreezeTransactions";
import { convertToMediaUseCase } from "./app/modules/media/useCases/convertToMedia";
import { updateOrganizationWithdrawalActDocumentUseCase } from "./app/modules/legal/useCases/organizationDocuments/updateOrganizationWithdrawalActDocument";
import { generateUserDocumentUseCase } from "./app/modules/legal/useCases/userDocuments/generateUserDocument";
import { createLegalsFromOrganizationsUseCase } from "./app/modules/legal/useCases/legal/createLegalsFromOrganizations";
import { generateOrganizationDocumentUseCase } from "./app/modules/legal/useCases/organizationDocuments/generateOrganizationDocument";
import { fixIncorrectPurchasesUseCase } from "./app/modules/finance/useCases/purchases/fixIncorrectPurchases";
import { integrationTest } from "./test/integrationTest";
import { bindPaymentsToPurchasesUseCase } from "./app/modules/finance/useCases/purchases/bindPaymentsToPurchases";
import { bindPaymentShopIdsToLegalsUseCase } from "./app/modules/legal/useCases/legal/bindPaymentShopIdsToLegals";
import { telegramService } from "./app/services/telegramService";
import { updateCouponStatisticsUseCase } from "./app/modules/organizations/useCases/coupons/updateCouponStatistics";

process.on('uncaughtException', (err) => {
    logger.error(err.stack!, err.message);
});

process.on('unhandledRejection', (err) => {
    logger.error('', err!.toString());
});

process.on('exit', (code: number) => {
    if (code == 1) logger.error(null as any, `SYSTEM: app has been terminated with code: ${code}. Free memory: ${process.memoryUsage().heapUsed}`);
    else logger.info(`SYSTEM: app has been terminated with code: ${code}. Free memory: ${process.memoryUsage().heapUsed}`);
});

process.on('beforeExit', (code: number) => {
    if (code == 1) logger.error(null as any, `SYSTEM: app has been terminated with code: ${code}. Free memory: ${process.memoryUsage().heapUsed}`);
    else logger.info(`SYSTEM: app has been terminated with code: ${code}. Free memory: ${process.memoryUsage().heapUsed}`);
});

process.on('SIGTERM', (sig) => {
    logger.error('SYSTEM:', 'app has been terminated with signal', sig);
});

(async function() {
    const app = new App();
    
    if (configProps.cluster) {
        await app.startCluster();
    } else {
        await app.start();

        if (process.argv.find(a => a == 'script')) {
            // const result = await payAccumulatedPaymentsUseCase.execute({
                
            // });
            // console.log(result);
        }

        if (process.argv.find(a => a == 'test')) {
            const result = await integrationTest.execute();
            if (result.isFailure) {
                const error = result.getError()!;
                logger.error(error.stack!, error.message, error.details);
                logger.error('', 'Test failed. Exit');
                
                process.exit(1);
            } else {
                logger.info('Test succeed. Exit');

                process.exit(0);
            }
        }

        // const result = await generateOrganizationDocumentUseCase.execute({
        //     organizationId: '60fec0e9cadfbd00125ee787',
        //     type: 'application',
        //     userId: '60feb9ebcadfbd00125edfd6'
        // });
        // console.log(result);

        // const result = await telegramService.send('purchaseCreated', {
        //     purchaseCode: '12345678',
        //     organizationName: 'Какой-то бузинес',
        //     purchaserName: 'Павлина Курокова',
        //     purchaseSum: '50.00',
        //     paymentType: 'Сплит',
        //     paymentSum: '45.00',
        //     bonusSum: '5.00',
        //     paymentDate: new Date().toISOString()
        // });
        // console.log(result);

        // const result = await bindPaymentsToPurchasesUseCase.execute({

        // });
        // console.log(result);
    }
})();


// (async function() {
//     try {
//         const app = new App();
//         await app.start();

//         // const result = await recalculateWalletBalanceUseCase.execute({});
//         // console.log(result);

//         // RECALCULATE UPON DISABLING !!!!

//     } catch (ex) {
//         logger.error(ex.stack, ex.message);
//     }
// })()