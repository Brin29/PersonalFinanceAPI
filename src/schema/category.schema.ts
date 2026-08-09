import mongoose, { Schema } from "mongoose";
import { ICategory } from "../entities/category.model";
import { CATEGORY_TYPES } from "../types/category.request";

const CategorySchema = new Schema<ICategory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },
    type: {
      type: String,
      enum: CATEGORY_TYPES,
      default: "expense",
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

CategorySchema.index(
  { key: 1 },
  { unique: true, partialFilterExpression: { isSystem: true } },
);

CategorySchema.index(
  { user: 1, key: 1 },
  { unique: true, partialFilterExpression: { isSystem: false } },
);

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
