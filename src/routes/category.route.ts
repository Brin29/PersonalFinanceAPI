import { FastifyInstance } from "fastify";
import { authenticate } from "../hooks/auth.hooks";
import {
  CategoryParamsRequest,
  CreateCategoryRequest,
  EditCategoryRequest,
} from "../dtos/category.dto";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  editCategoryHandler,
  getCategoriesHandler,
} from "../controllers/category.controller";
import { errorResponseSchema } from "../errors/responseCodes";

const categoryObject = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    key: { type: "string" },
    type: { type: "string", enum: ["income", "expense"] },
    isSystem: { type: "boolean" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
};

const authSecurity = [
  {
    cookieAuth: [],
  },
];

const errorResponses = {
  401: {
    description: "Token inválido o no proporcionado",
    type: "object",
    properties: errorResponseSchema.properties,
  },
  404: {
    description: "Categoría no encontrada",
    type: "object",
    properties: errorResponseSchema.properties,
  },
};

const listCategoriesSchema = {
  description:
    "Listar las categorías del sistema y las categorías propias del usuario",
  tags: ["Categories"],
  security: authSecurity,
  response: {
    200: {
      description: "Lista de categorías",
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        categories: {
          type: "array",
          items: categoryObject,
        },
      },
    },
    ...errorResponses,
  },
};

const createCategorySchema = {
  description: "Crear una nueva categoría propia",
  tags: ["Categories"],
  security: authSecurity,
  body: {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            description: "Nombre de la categoría",
          },
          type: {
            type: "string",
            enum: ["income", "expense"],
            default: "expense",
            description: "Tipo de categoría: ingreso o gasto",
          },
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      description: "Categoría creada",
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        category: categoryObject,
      },
    },
    400: {
      description: "Error de validación",
      type: "object",
      properties: errorResponseSchema.properties,
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: errorResponseSchema.properties,
    },
  },
};

const editCategorySchema = {
  description:
    "Editar una categoría. Si es del sistema, el cambio solo se aplica al usuario",
  tags: ["Categories"],
  security: authSecurity,
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", description: "ID de la categoría" },
    },
  },
  body: {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 50,
          },
          type: {
            type: "string",
            enum: ["income", "expense"],
            description: "Tipo de categoría: ingreso o gasto",
          },
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: "Categoría actualizada",
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        category: categoryObject,
      },
    },
    400: {
      description: "Error de validación",
      type: "object",
      properties: errorResponseSchema.properties,
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: errorResponseSchema.properties,
    },
    404: {
      description: "Categoría no encontrada",
      type: "object",
      properties: errorResponseSchema.properties,
    },
  },
};

const deleteCategorySchema = {
  description:
    "Eliminar una categoría. Si es del sistema, solo se oculta para el usuario",
  tags: ["Categories"],
  security: authSecurity,
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", description: "ID de la categoría" },
    },
  },
  response: {
    200: {
      description: "Categoría eliminada",
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
      },
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: errorResponseSchema.properties,
    },
    404: {
      description: "Categoría no encontrada",
      type: "object",
      properties: errorResponseSchema.properties,
    },
  },
};

export default async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/categories",
    { schema: listCategoriesSchema, preHandler: authenticate },
    getCategoriesHandler,
  );
  fastify.post<CreateCategoryRequest>(
    "/categories",
    { schema: createCategorySchema, preHandler: authenticate },
    createCategoryHandler,
  );
  fastify.patch<EditCategoryRequest>(
    "/categories/:id",
    { schema: editCategorySchema, preHandler: authenticate },
    editCategoryHandler,
  );
  fastify.delete<CategoryParamsRequest>(
    "/categories/:id",
    { schema: deleteCategorySchema, preHandler: authenticate },
    deleteCategoryHandler,
  );
}
