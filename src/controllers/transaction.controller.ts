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
import { SUCCESS_CODES } from "../errors/responseCodes";

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
    code: SUCCESS_CODES.TRANSACTION_CREATED.code,
    message: SUCCESS_CODES.TRANSACTION_CREATED.message,
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
    code: SUCCESS_CODES.TRANSACTION_UPDATED.code,
    message: SUCCESS_CODES.TRANSACTION_UPDATED.message,
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

  return reply.send({
    code: SUCCESS_CODES.TRANSACTION_DELETED.code,
    message: SUCCESS_CODES.TRANSACTION_DELETED.message,
  });
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

  return reply.send({
    code: SUCCESS_CODES.TRANSACTIONS_LISTED.code,
    message: SUCCESS_CODES.TRANSACTIONS_LISTED.message,
    transactions,
    pagination,
  });
}

export async function getSummaryHandler(
  request: FastifyRequest<SummaryRequest>,
  reply: FastifyReply,
) {
  const userId = getUserId(request);
  const { period } = request.query;

  const { summary, byMonth, byDay } = await getTransactionSummary(userId, period);

  return reply.send({
    code: SUCCESS_CODES.SUMMARY_GENERATED.code,
    message: SUCCESS_CODES.SUMMARY_GENERATED.message,
    summary,
    byMonth,
    byDay,
  });
}
