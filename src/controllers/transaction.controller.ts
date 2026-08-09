import { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateTransactionRequest,
  EditTransactionRequest,
  ListTransactionsRequest,
  SummaryRequest,
  TransactionParamsRequest,
} from "../dtos/transaction.dto";
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  getTransactionSummary,
  listTransactions,
} from "../services/transaction.service";

function getUserId(request: FastifyRequest) {
  return (request as any).user.id as string;
}

export async function createTransactionHandler(
  request: FastifyRequest<CreateTransactionRequest>,
  reply: FastifyReply,
) {
  const userId = getUserId(request);
  const { data } = request.body;

  const { transaction } = await createTransaction(userId, data);

  return reply.status(201).send({
    message: "Transacción creada exitosamente",
    transaction,
  });
}

export async function editTransactionHandler(
  request: FastifyRequest<EditTransactionRequest>,
  reply: FastifyReply,
) {
  const userId = getUserId(request);
  const { id: transactionId } = request.params;
  const { data } = request.body;

  const { transaction } = await editTransaction(userId, transactionId, data);

  return reply.send({
    message: "Transacción actualizada exitosamente",
    transaction,
  });
}

export async function deleteTransactionHandler(
  request: FastifyRequest<TransactionParamsRequest>,
  reply: FastifyReply,
) {
  const userId = getUserId(request);
  const { id: transactionId } = request.params;

  await deleteTransaction(userId, transactionId);

  return reply.send({ message: "Transacción eliminada exitosamente" });
}

export async function getTransactionsHandler(
  request: FastifyRequest<ListTransactionsRequest>,
  reply: FastifyReply,
) {
  const userId = getUserId(request);

  const { transactions, pagination } = await listTransactions(
    userId,
    request.query,
  );

  return reply.send({ transactions, pagination });
}

export async function getSummaryHandler(
  request: FastifyRequest<SummaryRequest>,
  reply: FastifyReply,
) {
  const userId = getUserId(request);
  const { period } = request.query;

  const { summary, byMonth, byDay } = await getTransactionSummary(userId, period);

  return reply.send({ summary, byMonth, byDay });
}
