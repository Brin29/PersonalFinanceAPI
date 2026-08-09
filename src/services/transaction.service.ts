import { Types } from "mongoose";
import Transaction from "../schema/transaction.schema";
import { resolveCategoryKey } from "./category.service";
import {
  CreateTransactionModel,
  EditTransactionModel,
  ListTransactionsModel,
  TransactionPeriod,
} from "../types/transaction.request";
import { AppError } from "../errors/app.error";

function toObjectId(id: string) {
  if (!Types.ObjectId.isValid(id)) throw new AppError("INVALID_ID");
  return new Types.ObjectId(id);
}

function getPeriodCutoff(period: TransactionPeriod): Date {
  const now = new Date();

  switch (period) {
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "3m": {
      const cutoff = new Date(now);
      cutoff.setMonth(cutoff.getMonth() - 3);
      return cutoff;
    }
    case "6m": {
      const cutoff = new Date(now);
      cutoff.setMonth(cutoff.getMonth() - 6);
      return cutoff;
    }
    default:
      throw new AppError("INVALID_PERIOD");
  }
}

export async function createTransaction(
  userId: string,
  data: CreateTransactionModel,
) {
  await resolveCategoryKey(userId, data.category);

  const transaction = await Transaction.create({
    user: toObjectId(userId),
    title: data.title,
    amount: data.amount,
    type: data.type,
    category: data.category,
    date: data.date ? new Date(data.date) : new Date(),
  });

  return { transaction };
}

export async function editTransaction(
  userId: string,
  transactionId: string,
  data: EditTransactionModel,
) {
  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.category !== undefined) {
    await resolveCategoryKey(userId, data.category);
    updateData.category = data.category;
  }
  if (data.date !== undefined) updateData.date = new Date(data.date);

  if (Object.keys(updateData).length === 0)
    throw new AppError("NO_FIELDS_TO_UPDATE");

  const transaction = await Transaction.findOneAndUpdate(
    { _id: toObjectId(transactionId), user: toObjectId(userId) },
    updateData,
    { returnDocument: "after" },
  );

  if (!transaction) throw new AppError("TRANSACTION_NOTFOUND");

  return { transaction };
}

export async function deleteTransaction(
  userId: string,
  transactionId: string,
) {
  const transaction = await Transaction.findOneAndDelete({
    _id: toObjectId(transactionId),
    user: toObjectId(userId),
  });

  if (!transaction) throw new AppError("TRANSACTION_NOTFOUND");

  return { transaction };
}

export async function listTransactions(
  userId: string,
  query: ListTransactionsModel,
) {
  const {
    type,
    category,
    period,
    sortBy = "date",
    order = "desc",
    page = 1,
    limit = 10,
  } = query;

  const filter: Record<string, unknown> = { user: toObjectId(userId) };
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (period) filter.date = { $gte: getPeriodCutoff(period) };

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    Transaction.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getTransactionSummary(
  userId: string,
  period?: TransactionPeriod,
) {
  const dailyCutoff = new Date();
  dailyCutoff.setDate(dailyCutoff.getDate() - 40);

  const userMatch = { user: toObjectId(userId) };
  const cutoff = period ? getPeriodCutoff(period) : null;
  const summaryMatch = cutoff
    ? { ...userMatch, date: { $gte: cutoff } }
    : userMatch;
  const dailyMatch = cutoff
    ? { ...userMatch, date: { $gte: cutoff } }
    : { ...userMatch, date: { $gte: dailyCutoff } };

  const [[result], byMonth, byDay] = await Promise.all([
    Transaction.aggregate([
      { $match: summaryMatch },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
          totalTransactions: { $sum: 1 },
        },
      },
    ]),
    Transaction.aggregate([
      { $match: summaryMatch },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } },
          },
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          income: 1,
          expense: 1,
        },
      },
    ]),
    Transaction.aggregate([
      { $match: dailyMatch },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          },
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          day: "$_id.day",
          income: 1,
          expense: 1,
        },
      },
    ]),
  ]);

  const totalIncome = result?.totalIncome ?? 0;
  const totalExpenses = result?.totalExpenses ?? 0;

  return {
    summary: {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      totalTransactions: result?.totalTransactions ?? 0,
    },
    byMonth,
    byDay,
  };
}
