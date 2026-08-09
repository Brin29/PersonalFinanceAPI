import { Types } from "mongoose";
import Category from "../schema/category.schema";
import { ICategory } from "../entities/category.model";
import {
  CATEGORY_TYPES,
  CategoryType,
  CreateCategoryModel,
  EditCategoryModel,
  SYSTEM_CATEGORIES,
  SYSTEM_CATEGORY_KEYS,
} from "../types/category.request";

type CategoryDoc = ICategory & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface CategoryResponse {
  _id: string;
  name: string;
  key: string;
  type: CategoryType;
  isSystem: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function toObjectId(id: string) {
  if (!Types.ObjectId.isValid(id))
    throw { status: 400, message: "ID inválido" };
  return new Types.ObjectId(id);
}

function toResponseCategory(category: CategoryDoc): CategoryResponse {
  return {
    _id: category._id.toString(),
    name: category.name,
    key: category.key,
    type: category.type,
    isSystem: category.isSystem || SYSTEM_CATEGORY_KEYS.includes(category.key),
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

async function isKeyTaken(userId: string, key: string): Promise<boolean> {
  if (SYSTEM_CATEGORY_KEYS.includes(key)) return true;

  const existing = await Category.exists({
    user: toObjectId(userId),
    key,
  });
  return Boolean(existing);
}

async function generateUniqueKey(
  userId: string,
  name: string,
): Promise<string> {
  const baseKey = slugify(name) || "categoria";
  let key = baseKey;
  let suffix = 2;

  while (await isKeyTaken(userId, key)) {
    key = `${baseKey}-${suffix}`;
    suffix += 1;
  }

  return key;
}

export async function seedSystemCategories(): Promise<void> {
  await Promise.all(
    SYSTEM_CATEGORIES.map((category) =>
      Category.updateOne(
        { key: category.key, isSystem: true },
        {
          $set: { name: category.name, type: category.type },
          $setOnInsert: { user: null, isSystem: true },
        },
        { upsert: true },
      ),
    ),
  );
}

export async function listCategories(userId: string) {
  const userObjectId = toObjectId(userId);

  const [systemCategories, userCategories] = await Promise.all([
    Category.find({ isSystem: true, user: null }).lean(),
    Category.find({ user: userObjectId }).lean(),
  ]);

  const userByKey = new Map<string, CategoryDoc>(
    userCategories.map((category) => [category.key, category]),
  );

  const effective: CategoryResponse[] = [];
  for (const system of systemCategories) {
    const override = userByKey.get(system.key);
    userByKey.delete(system.key);
    if (override?.isDeleted) continue;
    effective.push(toResponseCategory(override ?? system));
  }

  const systemOrder = new Map<string, number>(
    SYSTEM_CATEGORIES.map((category, index) => [category.key, index]),
  );
  effective.sort(
    (a, b) =>
      (systemOrder.get(a.key) ?? Infinity) - (systemOrder.get(b.key) ?? Infinity),
  );

  const custom = [...userByKey.values()]
    .filter((category) => !category.isDeleted)
    .map(toResponseCategory)
    .sort((a, b) => a.name.localeCompare(b.name));

  return { categories: [...effective, ...custom] };
}

export async function createCategory(
  userId: string,
  data: CreateCategoryModel,
) {
  const type = data.type ?? "expense";
  if (!CATEGORY_TYPES.includes(type))
    throw {
      status: 400,
      message: `Tipo de categoría inválido. Valores permitidos: ${CATEGORY_TYPES.join(", ")}`,
    };

  const key = await generateUniqueKey(userId, data.name);

  const category = await Category.create({
    user: toObjectId(userId),
    name: data.name,
    key,
    type,
    isSystem: false,
    isDeleted: false,
  });

  return { category: toResponseCategory(category) };
}

export async function editCategory(
  userId: string,
  categoryId: string,
  data: EditCategoryModel,
) {
  if (data.name === undefined || data.name === "")
    throw {
      status: 400,
      message: "Debe proporcionar un nombre para actualizar",
    };

  if (data.type !== undefined && !CATEGORY_TYPES.includes(data.type))
    throw {
      status: 400,
      message: `Tipo de categoría inválido. Valores permitidos: ${CATEGORY_TYPES.join(", ")}`,
    };

  const category = await Category.findById(toObjectId(categoryId)).lean();

  if (!category)
    throw {
      status: 404,
      message: "Categoría no encontrada",
    };

  if (category.isSystem) {
    const override = await Category.findOneAndUpdate(
      { user: toObjectId(userId), key: category.key, isSystem: false },
      {
        $set: {
          name: data.name,
          type: data.type ?? category.type,
          isDeleted: false,
        },
        $setOnInsert: {
          user: toObjectId(userId),
          key: category.key,
          isSystem: false,
        },
      },
      { upsert: true, returnDocument: "after" },
    ).lean();

    return { category: toResponseCategory(override) };
  }

  const updated = await Category.findOneAndUpdate(
    { _id: toObjectId(categoryId), user: toObjectId(userId), isSystem: false },
    {
      $set: {
        name: data.name,
        ...(data.type !== undefined ? { type: data.type } : {}),
      },
    },
    { returnDocument: "after" },
  ).lean();

  if (!updated)
    throw {
      status: 404,
      message: "Categoría no encontrada o no se puede editar",
    };

  return { category: toResponseCategory(updated) };
}

export async function deleteCategory(userId: string, categoryId: string) {
  const category = await Category.findById(toObjectId(categoryId)).lean();

  if (!category)
    throw {
      status: 404,
      message: "Categoría no encontrada",
    };

  if (category.isSystem) {
    await Category.updateOne(
      { user: toObjectId(userId), key: category.key, isSystem: false },
      {
        $set: {
          name: category.name,
          type: category.type,
          isDeleted: true,
        },
        $setOnInsert: {
          user: toObjectId(userId),
          key: category.key,
          isSystem: false,
        },
      },
      { upsert: true },
    );

    return { category: toResponseCategory(category) };
  }

  const deleted = await Category.findOneAndDelete({
    _id: toObjectId(categoryId),
    user: toObjectId(userId),
    isSystem: false,
  }).lean();

  if (!deleted)
    throw {
      status: 404,
      message: "Categoría no encontrada o no se puede eliminar",
    };

  return { category: toResponseCategory(deleted) };
}

export async function resolveCategoryKey(
  userId: string,
  key: string,
): Promise<void> {
  if (SYSTEM_CATEGORY_KEYS.includes(key)) return;

  const exists = await Category.exists({
    user: toObjectId(userId),
    key,
  });

  if (!exists)
    throw {
      status: 400,
      message: "Categoría inválida o no pertenece al usuario",
    };
}
