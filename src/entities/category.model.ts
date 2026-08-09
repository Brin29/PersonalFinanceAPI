import { Types } from "mongoose";
import { CategoryType } from "../types/category.request";

export interface ICategory {
  user: Types.ObjectId | null;
  name: string;
  key: string;
  type: CategoryType;
  isSystem: boolean;
  isDeleted: boolean;
}
