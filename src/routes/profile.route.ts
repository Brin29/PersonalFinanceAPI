import { FastifyInstance } from "fastify";
import { authenticate } from "../hooks/auth.hooks";
import { EditProfileRequest } from "../dtos/auth.dto";
import {
  changeAvatar,
  editProfile,
  getProfile,
} from "../controllers/profile.controller";
import { errorResponseSchema } from "../errors/responseCodes";

const profileSchema = {
  description: "Obtener perfil del usuario autenticado",
  tags: ["Auth"],
  security: [
    {
      cookieAuth: [],
    },
  ],
  response: {
    200: {
      description: "Perfil del usuario",
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            avatar: { type: "string" },
            provider: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
          },
        },
      },
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
      },
    },
  },
};

const editProfileSchema = {
  description: "Actualizar nombre y apellido del perfil",
  tags: ["Auth"],
  security: [
    {
      cookieAuth: [],
    },
  ],
  body: {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        type: "object",
        properties: {
          firstName: { type: "string", description: "Nuevo nombre" },
          lastName: { type: "string", description: "Nuevo apellido" },
        },
      },
    },
  },
  response: {
    200: {
      description: "Perfil actualizado exitosamente",
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            avatar: { type: "string" },
            provider: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
          },
        },
      },
    },
    400: {
      description: "Error de validación",
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
      },
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
      },
    },
  },
};

const changeAvatarSchema = {
  description: "Cambiar avatar del usuario autenticado",
  tags: ["Auth"],
  security: [
    {
      cookieAuth: [],
    },
  ],
  consumes: ["multipart/form-data"],
  body: {
    type: "object",
    required: ["avatar"],
    properties: {
      avatar: {
        type: "string",
        format: "binary",
        description: "Archivo de imagen (jpeg, png, webp, gif – máx 5MB)",
      },
    },
  },
  response: {
    200: {
      description: "Avatar actualizado exitosamente",
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            avatar: { type: "string" },
            provider: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
          },
        },
      },
    },
    400: {
      description: "Error de validación o archivo inválido",
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

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/auth/profile",
    { schema: profileSchema, preHandler: authenticate },
    getProfile,
  );
  fastify.patch<EditProfileRequest>(
    "/auth/profile",
    { schema: editProfileSchema, preHandler: authenticate },
    editProfile,
  );
  fastify.post(
    "/auth/avatar",
    {
      schema: changeAvatarSchema,
      preHandler: authenticate,
      validatorCompiler: () => () => true,
    },
    changeAvatar,
  );
}
