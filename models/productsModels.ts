import mongoose, { Schema } from "mongoose"

const productsSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false },
    category: { type: String, required: true }
})

export const productsModels = (mongoose.models.products || mongoose.model('products', productsSchema))