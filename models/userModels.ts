import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, required: false },
    cart: { type: Array, required: false }
})

export const userModels = (mongoose.models.users || mongoose.model('users', userSchema))