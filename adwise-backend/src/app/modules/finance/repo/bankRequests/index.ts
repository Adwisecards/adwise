import { BankRequestModel } from "../../models/BankRequest";
import { BankRequestRepo } from "./implementation/BankRequestRepo";

export const bankRequestRepo = new BankRequestRepo(BankRequestModel);