import { Types } from "mongoose";
import {
  TransactionCategory,
  TransactionType,
} from "../types/transaction.request";

export interface ITransaction {
  user: Types.ObjectId;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: Date;
}
