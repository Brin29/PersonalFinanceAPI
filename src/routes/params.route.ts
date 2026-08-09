import { FastifyInstance } from "fastify";
import { authenticate } from "../hooks/auth.hooks";
import { getParamsHandler } from "../controllers/params.controller";
import { errorResponseSchema } from "../errors/responseCodes";

const authSecurity = [
  {
    cookieAuth: [],
  },
];

const paramsSchema = {
  description: "Listar categorías, tipos y períodos disponibles",
  tags: ["Params"],
  security: authSecurity,
  response: {
    200: {
      description: "Parámetros del sistema",
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        categories: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              name: { type: "string" },
              type: { type: "string", enum: ["income", "expense"] },
            },
          },
        },
        types: {
          type: "array",
          items: {
            type: "object",
            properties: {
              value: { type: "string", enum: ["income", "expense"] },
              label: { type: "string" },
            },
          },
        },
        periods: {
          type: "array",
          items: {
            type: "object",
            properties: {
              value: { type: "string", enum: ["7d", "30d", "3m", "6m"] },
              label: { type: "string" },
            },
          },
        },
      },
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: errorResponseSchema.properties,
    },
  },
};

export default async function paramsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/params",
    { schema: paramsSchema, preHandler: authenticate },
    getParamsHandler,
  );
}
