export const CATEGORY_TYPES = ["income", "expense"] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];

export const SYSTEM_CATEGORIES = [
  { name: "Salario", key: "salary", type: "income" },
  { name: "Comida", key: "food", type: "expense" },
  { name: "Transporte", key: "transport", type: "expense" },
  { name: "Vivienda", key: "housing", type: "expense" },
  { name: "Entretenimiento", key: "entertainment", type: "expense" },
  { name: "Salud", key: "health", type: "expense" },
  { name: "Compras", key: "shopping", type: "expense" },
  { name: "Otros", key: "other", type: "expense" },
] as const;

export const SYSTEM_CATEGORY_KEYS = SYSTEM_CATEGORIES.map(
  (category) => category.key,
) as readonly string[];

export interface CreateCategoryModel {
  name: string;
  type?: CategoryType;
}

export interface EditCategoryModel {
  name?: string;
  type?: CategoryType;
}

export interface CategoryParamsModel {
  id: string;
}
