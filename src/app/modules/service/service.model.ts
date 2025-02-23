import mongoose, { Schema } from "mongoose";
import { TService } from "./service.interface";

const serviceSchema = new Schema<TService>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Service = mongoose.model<TService>("Service", serviceSchema);
