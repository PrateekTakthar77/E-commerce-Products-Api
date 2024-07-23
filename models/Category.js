import { default as mongoose } from "mongoose";

const categorySchema = mongoose.Schema({
    name: { type: String },
    subcategory: [{ type: String }],
});
const Category = mongoose.model("category", categorySchema);

export default Category;
