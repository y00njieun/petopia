import mongoose, { Schema, Document } from "mongoose";

export interface IProductImage extends Document {
  product_id: string;
  main_image: string;
  small_image: string;
  detail_images: string[];
}

const ProductImageSchema: Schema = new Schema({
  product_id: { type: String, required: true },
  main_image: { type: String, required: true },
  small_image: { type: String, required: true },
  detail_images: { type: [String], default: [] },
});

export default mongoose.model<IProductImage>("ProductImage", ProductImageSchema);
