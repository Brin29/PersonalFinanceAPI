import { listCategories } from "./category.service";
import { CATEGORY_TYPES } from "../types/category.request";
import { TRANSACTION_PERIODS } from "../types/transaction.request";
import {
  CATEGORY_TYPE_LABELS,
  PERIOD_LABELS,
  ParamsModel,
} from "../types/params.request";

export async function getParams(userId: string): Promise<ParamsModel> {
  const { categories } = await listCategories(userId);

  return {
    categories: categories.map(({ key, name, type }) => ({ key, name, type })),
    types: CATEGORY_TYPES.map((value) => ({
      value,
      label: CATEGORY_TYPE_LABELS[value],
    })),
    periods: TRANSACTION_PERIODS.map((value) => ({
      value,
      label: PERIOD_LABELS[value],
    })),
  };
}
