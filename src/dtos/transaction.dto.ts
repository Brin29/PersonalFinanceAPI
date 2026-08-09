import {
  CreateTransactionModel,
  EditTransactionModel,
  ListTransactionsModel,
  TransactionParamsModel,
  TransactionPeriod,
} from "../types/transaction.request";
import { Request } from "../types/request";

export interface CreateTransactionRequest {
  Body: Request<CreateTransactionModel>;
}

export interface EditTransactionRequest {
  Body: Request<EditTransactionModel>;
  Params: TransactionParamsModel;
}

export interface ListTransactionsRequest {
  Querystring: ListTransactionsModel;
}

export interface SummaryRequest {
  Querystring: { period?: TransactionPeriod };
}

export interface TransactionParamsRequest {
  Params: TransactionParamsModel;
}
