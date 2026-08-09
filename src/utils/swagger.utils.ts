import { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { env } from "../env"

export async function registerSwagger(fastify: FastifyInstance) {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "DevPulse API",
        description: "API de DevPulse - Sistema de gestión de proyectos",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:4000",
          description: "Servidor de desarrollo",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: env.COOKIE_SECRET,
          },
        },
      },
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });
}
