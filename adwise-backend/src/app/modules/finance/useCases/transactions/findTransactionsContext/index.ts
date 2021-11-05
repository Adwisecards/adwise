import { organizationRepo } from "../../../../organizations/repo/organizations";
import { purchaseRepo } from "../../../repo/purchases";
import { transactionRepo } from "../../../repo/transactions";
import { walletRepo } from "../../../repo/wallets";
import { FindTransactionsContextUseCase } from "./FindTransactionsContextUseCase";

export const findTransactionsContextUseCase = new FindTransactionsContextUseCase(
    walletRepo,
    purchaseRepo,
    transactionRepo,
    organizationRepo
);

// [
//     {
//       context: '',
//       complete: true,
//       disabled: false,
//       origin: 'online',
//       _id: 5fc8d943db954600270154de,
//       to: 5fc237673630030027755fd5,
//       currency: 'rub',
//       type: 'adwise',
//       sum: 23.75,
//       timestamp: 2020-12-03T12:25:39.872Z,
//       __v: 0
//     },
//     {
//       context: '',
//       complete: true,
//       disabled: false,
//       origin: 'online',
//       _id: 5fc8d943db954600270154df,
//       to: 5fc237673630030027755fd5,
//       currency: 'rub',
//       type: 'managerPercent',
//       sum: 1.25,
//       timestamp: 2020-12-03T12:25:39.874Z,
//       __v: 0
//     },
//     {
//       context: '',
//       complete: true,
//       disabled: false,
//       origin: 'online',
//       _id: 5fc8d943db954600270154e1,
//       to: 5fc241969d902b0028dc3c4c,
//       currency: 'rub',
//       type: 'offer',
//       sum: 50,
//       timestamp: 2020-12-03T12:25:39.879Z,
//       __v: 0
//     },
//     {
//       context: '',
//       complete: true,
//       disabled: false,
//       origin: 'online',
//       _id: 5fc8d943db954600270154e2,
//       from: 5fc241969d902b0028dc3c4c,
//       to: 5fc7f638c9c85f0027c797b4,
//       currency: 'rub',
//       type: 'purchase',
//       sum: 250,
//       timestamp: 2020-12-03T12:25:39.881Z,
//       __v: 0
//     },
//     {
//       context: '',
//       complete: true,
//       disabled: false,
//       origin: 'online',
//       _id: 5fc8d943db954600270154ef,
//       to: 5fc7f638c9c85f0027c797b4,
//       currency: 'rub',
//       type: 'refBackToOrganization',
//       sum: 175,
//       timestamp: 2020-12-03T12:25:39.947Z,
//       __v: 0
//     }
// ]