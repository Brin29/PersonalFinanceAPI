import mongoose, { Schema } from "mongoose";
import { ITransaction } from "../entities/transaction.model";
import { TransactionType } from "../types/transaction.request";

const TransactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 120,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema,
);

export default Transaction;
