import {
  CategoryParamsModel,
  CreateCategoryModel,
  EditCategoryModel,
} from "../types/category.request";
import { Request } from "../types/request";

export interface CreateCategoryRequest {
  Body: Request<CreateCategoryModel>;
}

export interface EditCategoryRequest {
  Body: Request<EditCategoryModel>;
  Params: CategoryParamsModel;
}

export interface CategoryParamsRequest {
  Params: CategoryParamsModel;
}
