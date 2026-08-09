import { FastifyRequest, FastifyReply } from "fastify";
import {
  CategoryParamsRequest,
  CreateCategoryRequest,
  EditCategoryRequest,
} from "../dtos/category.dto";
import {
  createCategory,
  deleteCategory,
  editCategory,
  listCategories,
} from "../services/category.service";
import { SUCCESS_CODES } from "../errors/responseCodes";

function getUserId(request: FastifyRequest) {
  return (request as any).user.id as string;
}

export async function getCategoriesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getUserId(request);

  const { categories } = await listCategories(userId);

  return reply.send({
    code: SUCCESS_CODES.CATEGORIES_LISTED.code,
    message: SUCCESS_CODES.CATEGORIES_LISTED.message,
    categories,
  });
}

export async function createCategoryHandler(
  request: FastifyRequest<CreateCategoryRequest>,
  reply: FastifyReply,
) {
  const userId = getUserId(request);
  const { data } = request.body;

  const { category } = await createCategory(userId, data);

  return reply.status(201).send({
    code: SUCCESS_CODES.CATEGORY_CREATED.code,
    message: SUCCESS_CODES.CATEGORY_CREATED.message,
    category,
  });
}

export async function editCategoryHandler(
  request: FastifyRequest<EditCategoryRequest>,
  reply: FastifyReply,
) {
  const userId = getUserId(request);
  const { id: categoryId } = request.params;
  const { data } = request.body;

  const { category } = await editCategory(userId, categoryId, data);

  return reply.send({
    code: SUCCESS_CODES.CATEGORY_UPDATED.code,
    message: SUCCESS_CODES.CATEGORY_UPDATED.message,
    category,
  });
}

export async function deleteCategoryHandler(
  request: FastifyRequest<CategoryParamsRequest>,
  reply: FastifyReply,
) {
  const userId = getUserId(request);
  const { id: categoryId } = request.params;

  await deleteCategory(userId, categoryId);

  return reply.send({
    code: SUCCESS_CODES.CATEGORY_DELETED.code,
    message: SUCCESS_CODES.CATEGORY_DELETED.message,
  });
}
