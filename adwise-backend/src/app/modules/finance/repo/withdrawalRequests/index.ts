import { WithdrawalRequest } from "../../models/WithdrawalRequest";
import { WithdrawalRequestRepo } from "./implementation/WithdrawalRequestRepo";

const withdrawalRequestRepo = new WithdrawalRequestRepo(WithdrawalRequest);

export {
    withdrawalRequestRepo
};