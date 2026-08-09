import { CategoryType } from "./category.request";
import { TransactionPeriod } from "./transaction.request";

export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  income: "Ingreso",
  expense: "Gasto",
};

export const PERIOD_LABELS: Record<TransactionPeriod, string> = {
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "3m": "Últimos 3 meses",
  "6m": "Últimos 6 meses",
};

export interface ParamsModel {
  categories: Array<{ key: string; name: string; type: CategoryType }>;
  types: Array<{ value: CategoryType; label: string }>;
  periods: Array<{ value: TransactionPeriod; label: string }>;
}
