export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export const TRANSACTION_CATEGORIES = [
  "salary",
  "food",
  "transport",
  "housing",
  "entertainment",
  "health",
  "shopping",
  "other",
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export const TRANSACTION_PERIODS = ["7d", "30d", "3m", "6m"] as const;

export type TransactionPeriod = (typeof TRANSACTION_PERIODS)[number];

export interface CreateTransactionModel {
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date?: string;
}

export interface EditTransactionModel {
  title?: string;
  amount?: number;
  type?: TransactionType;
  category?: TransactionCategory;
  date?: string;
}

export interface ListTransactionsModel {
  type?: TransactionType;
  category?: TransactionCategory;
  period?: TransactionPeriod;
  sortBy?: "date" | "amount";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface TransactionParamsModel {
  id: string;
}
