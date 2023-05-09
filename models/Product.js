import mongoose, { Schema, model, models } from "mongoose";
import { Category } from "@/models/Category.js";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    images: [{ type: String }],
    category: { type: mongoose.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product || model("Product", ProductSchema);
