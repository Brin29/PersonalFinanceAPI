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

function getUserId(request: FastifyRequest) {
  return (request as any).user.id as string;
}

export async function getCategoriesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getUserId(request);

  const { categories } = await listCategories(userId);

  return reply.send({ categories });
}

export async function createCategoryHandler(
  request: FastifyRequest<CreateCategoryRequest>,
  reply: FastifyReply,
) {
  const userId = getUserId(request);
  const { data } = request.body;

  const { category } = await createCategory(userId, data);

  return reply.status(201).send({
    message: "Categoría creada exitosamente",
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
    message: "Categoría actualizada exitosamente",
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

  return reply.send({ message: "Categoría eliminada exitosamente" });
}
