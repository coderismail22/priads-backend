import { Schema, model } from "mongoose";
import { TCategory } from "./category.interface";

const CategorySchema = new Schema<TCategory>({
  name: { type: String, required: true, trim: true },
  img: { type: String, required: true, trim: true },
});

export const Category = model<TCategory>("Category", CategorySchema);
