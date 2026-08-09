import { FastifyInstance } from "fastify";
import { authenticate } from "../hooks/auth.hooks";
import {
  CreateTransactionRequest,
  EditTransactionRequest,
  ListTransactionsRequest,
  TransactionParamsRequest,
} from "../dtos/transaction.dto";
import {
  createTransactionHandler,
  deleteTransactionHandler,
  editTransactionHandler,
  getSummaryHandler,
  getTransactionsHandler,
} from "../controllers/transaction.controller";

const transactionObject = {
  type: "object",
  properties: {
    _id: { type: "string" },
    title: { type: "string" },
    amount: { type: "number" },
    type: { type: "string" },
    category: { type: "string" },
    date: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
};

const authSecurity = [
  {
    cookieAuth: [],
  },
];

const listTransactionsSchema = {
  description: "Listar transacciones del usuario con filtros y ordenamiento",
  tags: ["Transactions"],
  security: authSecurity,
  querystring: {
    type: "object",
    properties: {
      type: { type: "string", enum: ["income", "expense"] },
      category: {
        type: "string",
        maxLength: 50,
        description:
          "Categoría de la transacción (key de una categoría del sistema o propia)",
      },
      period: {
        type: "string",
        enum: ["7d", "30d", "3m", "6m"],
        description: "Filtrar por período: 7d, 30d, 3m o 6m",
      },
      sortBy: { type: "string", enum: ["date", "amount"], default: "date" },
      order: { type: "string", enum: ["asc", "desc"], default: "desc" },
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 10 },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: "Lista de transacciones",
      type: "object",
      properties: {
        transactions: {
          type: "array",
          items: transactionObject,
        },
        pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
          },
        },
      },
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: { error: { type: "string" } },
    },
  },
};

const summarySchema = {
  description: "Resumen de ingresos, gastos y balance neto del usuario",
  tags: ["Transactions"],
  security: authSecurity,
  querystring: {
    type: "object",
    properties: {
      period: {
        type: "string",
        enum: ["7d", "30d", "3m", "6m"],
        description: "Filtrar por período: 7d, 30d, 3m o 6m",
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: "Resumen financiero",
      type: "object",
      properties: {
        summary: {
          type: "object",
          properties: {
            totalIncome: { type: "number" },
            totalExpenses: { type: "number" },
            netBalance: { type: "number" },
            totalTransactions: { type: "number" },
          },
        },
        byMonth: {
          type: "array",
          description: "Desglose mensual de ingresos y gastos",
          items: {
            type: "object",
            properties: {
              month: {
                type: "string",
                description: "Mes en formato YYYY-MM",
              },
              income: { type: "number" },
              expense: { type: "number" },
            },
          },
        },
        byDay: {
          type: "array",
          description: "Desglose diario de ingresos y gastos",
          items: {
            type: "object",
            properties: {
              day: {
                type: "string",
                description: "Día en formato YYYY-MM-DD",
              },
              income: { type: "number" },
              expense: { type: "number" },
            },
          },
        },
      },
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: { error: { type: "string" } },
    },
  },
};

const createTransactionSchema = {
  description: "Crear una nueva transacción",
  tags: ["Transactions"],
  security: authSecurity,
  body: {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        type: "object",
        required: ["title", "amount", "type", "category"],
        properties: {
          title: {
            type: "string",
            minLength: 1,
            maxLength: 120,
            description: "Título de la transacción",
          },
          amount: {
            type: "number",
            exclusiveMinimum: 0,
            description: "Monto de la transacción",
          },
          type: {
            type: "string",
            enum: ["income", "expense"],
            description: "Tipo: income o expense",
          },
          category: {
            type: "string",
            maxLength: 50,
            description:
              "Categoría de la transacción (key de una categoría del sistema o propia)",
          },
          date: {
            type: "string",
            format: "date-time",
            description: "Fecha de la transacción (ISO 8601)",
          },
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      description: "Transacción creada",
      type: "object",
      properties: {
        message: { type: "string" },
        transaction: transactionObject,
      },
    },
    400: {
      description: "Error de validación",
      type: "object",
      properties: { error: { type: "string" } },
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: { error: { type: "string" } },
    },
  },
};

const editTransactionSchema = {
  description: "Editar una transacción existente",
  tags: ["Transactions"],
  security: authSecurity,
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", description: "ID de la transacción" },
    },
  },
  body: {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        type: "object",
        properties: {
          title: {
            type: "string",
            minLength: 1,
            maxLength: 120,
          },
          amount: { type: "number", exclusiveMinimum: 0 },
          type: { type: "string", enum: ["income", "expense"] },
          category: {
            type: "string",
            maxLength: 50,
            description:
              "Categoría de la transacción (key de una categoría del sistema o propia)",
          },
          date: { type: "string", format: "date-time" },
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: "Transacción actualizada",
      type: "object",
      properties: {
        message: { type: "string" },
        transaction: transactionObject,
      },
    },
    400: {
      description: "Error de validación",
      type: "object",
      properties: { error: { type: "string" } },
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: { error: { type: "string" } },
    },
    404: {
      description: "Transacción no encontrada",
      type: "object",
      properties: { error: { type: "string" } },
    },
  },
};

const deleteTransactionSchema = {
  description: "Eliminar una transacción",
  tags: ["Transactions"],
  security: authSecurity,
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", description: "ID de la transacción" },
    },
  },
  response: {
    200: {
      description: "Transacción eliminada",
      type: "object",
      properties: { message: { type: "string" } },
    },
    401: {
      description: "Token inválido o no proporcionado",
      type: "object",
      properties: { error: { type: "string" } },
    },
    404: {
      description: "Transacción no encontrada",
      type: "object",
      properties: { error: { type: "string" } },
    },
  },
};

export default async function transactionRoutes(fastify: FastifyInstance) {
  fastify.get<ListTransactionsRequest>(
    "/transactions",
    { schema: listTransactionsSchema, preHandler: authenticate },
    getTransactionsHandler,
  );
  fastify.get(
    "/transactions/summary",
    { schema: summarySchema, preHandler: authenticate },
    getSummaryHandler,
  );
  fastify.post<CreateTransactionRequest>(
    "/transactions",
    { schema: createTransactionSchema, preHandler: authenticate },
    createTransactionHandler,
  );
  fastify.patch<EditTransactionRequest>(
    "/transactions/:id",
    { schema: editTransactionSchema, preHandler: authenticate },
    editTransactionHandler,
  );
  fastify.delete<TransactionParamsRequest>(
    "/transactions/:id",
    { schema: deleteTransactionSchema, preHandler: authenticate },
    deleteTransactionHandler,
  );
}
