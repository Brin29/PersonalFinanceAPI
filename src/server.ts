import "dotenv/config"
import Fastify from "fastify";
import { connectDatabase } from "./utils/database.utils";
import { registerSwagger } from "./utils/swagger.utils";
import authRoutes from "./routes/auth.route";
import profileRoutes from "./routes/profile.route";
import transactionRoutes from "./routes/transaction.route";
import categoryRoutes from "./routes/category.route";
import paramsRoutes from "./routes/params.route";
import { seedSystemCategories } from "./services/category.service";
// import teamRoutes from "./routes/team.routes";
// import taskRoutes from "./routes/task.routes";
// import reportRoutes from "./routes/report.routes";
// import userRoutes from "./routes/user.routes";
import cors from "./plugins/cors";
import googleOAuth from "./plugins/googleOAuth";
import githubOAuth from "./plugins/githubOAuth";
import multipart from "./plugins/multipart";
import cookie from "./plugins/cookie";
import rateLimit from "./plugins/rateLimit";
import { testCloudinary } from "./utils/cloudinary.utils";
import { AppError } from "./errors/app.error";
import { ERROR_CODES } from "./errors/responseCodes";
// import helmet from "./plugins/helmet";

const fastify = Fastify({ logger: true });

fastify.setErrorHandler((error: any, _, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.status).send({
      code: error.code,
      message: error.message,
    });
  }

  if (error.validation) {
    return reply.status(ERROR_CODES.VALIDATION_ERROR.status).send({
      code: ERROR_CODES.VALIDATION_ERROR.code,
      message: ERROR_CODES.VALIDATION_ERROR.message,
    });
  }

  const statusCode = error.status ?? error.statusCode;

  if (statusCode === 429) {
    return reply.status(429).send({
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED.code,
      message: ERROR_CODES.RATE_LIMIT_EXCEEDED.message,
    });
  }

  reply.log.error(error);

  return reply.status(ERROR_CODES.INTERNAL_ERROR.status).send({
    code: ERROR_CODES.INTERNAL_ERROR.code,
    message: ERROR_CODES.INTERNAL_ERROR.message,
  });
});

const start = async () => {
  try {
    await fastify.register(cors);
    await fastify.register(cookie);
    await fastify.register(rateLimit);
    await connectDatabase();
    await testCloudinary();
    await registerSwagger(fastify);
    // await fastify.register(helmet);
    await fastify.register(googleOAuth);
    await fastify.register(githubOAuth);
    await fastify.register(multipart);
    await fastify.register(authRoutes);
    await fastify.register(profileRoutes);
    await fastify.register(transactionRoutes);
    await fastify.register(categoryRoutes);
    await fastify.register(paramsRoutes);
    await seedSystemCategories();
    // await fastify.register(teamRoutes);
    // await fastify.register(taskRoutes);
    // await fastify.register(reportRoutes);
    // await fastify.register(userRoutes);
    await fastify.listen({
      port: Number(process.env.PORT),
      host: "0.0.0.0",
    });
    console.log(`Servidor corriendo en ${process.env.APP_URL}`);
    console.log(`Documentación Swagger en ${process.env.APP_URL}/docs`);
  } catch (err) {
    fastify.log.error(err);
  }
};

start();