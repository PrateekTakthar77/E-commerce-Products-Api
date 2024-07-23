const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const Category = mongoose.model("category", categorySchema);
const subCategory = mongoose.model("subcategory", subcategorySchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    images: [String],
    mcharges: Number,
    category: String,
    subcategory: { type: String },
    brand: String,
    material: String,
    purity: String,
    size: String,
    weight: String,
    color: String,
    gemstones: [
        {
            name: String,
            carat: Number,
        },
    ],
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, required: true },
            comment: String,
        },
    ],
});

const Product = mongoose.model("product", productSchema);

module.exports = { Product, Category, subCategory };
