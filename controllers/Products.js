const { Product, Category, subCategory } = require("../models/Product");

const getAllProducts = async (req, res) => {
    const { search, searchPurity, limit, offset, minPrice, maxPrice } = req.query;
    parseFloat(req.query.minPrice) || 0; // Minimum price filter
    parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER; // Maximum price filter

    console.log(`SEARCH All Products minprice`, minPrice);
    console.log(`SEARCH Purity`, searchPurity);
    try {
        let products;
        const query = {};

        if (search) {
            query.$or = [
                { category: search },
                { subcategory: search },
                { name: new RegExp(search, "i") },
                { purity: new RegExp(search, "i") },
            ];
        }

        parseFloat(req.query.minPrice) // Minimum price filter
        parseFloat(req.query.maxPrice) // Maximum price filter

        if (searchPurity) {
            query.purity = new RegExp(searchPurity, "i");
        }

        const options = {};
        if (limit) {
            options.limit = parseInt(limit);
        }
        if (offset) {
            options.skip = parseInt(offset);
        }

        // Fprice range filter  provided
        if (minPrice || maxPrice < Number.MAX_SAFE_INTEGER) {
            query.price = { $gte: minPrice, $lte: maxPrice };
        }

        if (Object.keys(query).length > 0) {
            products = await Product.find(query, null, options);
        } else {
            products = await Product.find({}, options);
        }

        const totalProducts = await Product.countDocuments(query);

        res.json({
            total: totalProducts,
            limit: limit ? parseInt(limit) : null,
            offset: offset ? parseInt(offset) : null,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ error: error, message: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error, message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId).populate(
            "category",
            "name",
        );

        if (!product) {
            return res
                .status(404)
                .json({ error: "Product not found", pid: productId });
        }
        res.status(200).json(product);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            images,
            category,
            brand,
            material,
            size,
            color,
            reviews,
            mrp,
            subcategory,
            weight,
            purity,
            mcharges,
        } = req.body;
        const product = new Product({
            name,
            description,
            price,
            images,
            category,
            brand,
            material,
            size,
            color,
            reviews,
            mrp,
            subcategory,
            weight,
            purity,
            mcharges,
        });
        await product.save();
        res.status(201).json({
            message: "Product added successfully",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            payload: null,
            message: error.message || "An error occurred",
        });
    }
};

// Add Multiple products (accessible to Dealer and Admin)
const addMultipleProducts = async (req, res) => {
    try {
        const { products } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                error: "Invalid request body. Expected an array of products.",
            });
        }

        const createdProducts = await Product.create(products);

        res.status(201).json({
            message: "Products added successfully",
            products: createdProducts,
        });
    } catch (error) {
        res.status(500).json({
            payload: null,
            message: error.message || "An error occurred",
        });
    }
};

const editProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        images,
        category,
        brand,
        material,
        size,
        weight,
        color,
        reviews,
        mrp,
        purity,
        mcharges,
    } = req.body;

    const { productId } = req.params;

    let categoryName;
    try {
        // Replace with the actual category name
        if (category && typeof category === "object" && category.name) {
            categoryName = category.name.toLowerCase();
        } else if (category && typeof category === "string") {
            categoryName = category.toLowerCase();
        } else {
            categoryName = "uncategorized";
        }

        // Find the category by its name
        let categoryInDb = await Category.findOne({ name: categoryName });

        // If the category doesn't exist, create a new one
        if (!categoryInDb) {
            categoryInDb = new Category({ name: categoryName });
            await categoryInDb.save();
        }

        const product = await Product.findById(productId).populate(
            "category",
            "name",
        );

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.images = images || product.images;
        product.category = categoryInDb._id || product.category;
        product.brand = brand || product.brand;
        product.material = material || product.material;
        product.size = size || product.size;
        product.weight = weight || product.weight;
        product.color = color || product.color;
        product.reviews = reviews || product.reviews;
        product.mrp = mrp || product.mrp;
        product.purity = purity || product.purity;
        product.mcharges = mcharges || product.mcharges;

        await product.save();
        console.log("product", product);
        res.json({
            message: "Product updated successfully",
            product,
            categoryName: product.category.name,
        });
    } catch (error) {
        res.status(500).json({
            payload: null,
            message: error.message || "An error occurred",
        });
    }
};

const applyDiscount = async (req, res) => {
    try {
        const { productId } = req.params;
        const { percentDiscout, flatDiscount } = req.body;
        console.log("ss", flatDiscount, percentDiscout, productId);
        if (!percentDiscout & !flatDiscount) {
            return res
                .status(401)
                .json({ error: "Provide some discount to apply" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // discount logic here
        if (percentDiscout) {
            //This line might help in not give discount max than 20%
            const maxDiscount = 20;
            const valueToDiscount = (product.mrp / 100) * percentDiscout;
            if (valueToDiscount <= (product.mrp / 100) * maxDiscount) {
                product.price = product.mrp - valueToDiscount;
                await product.save();
            }
        } else if (flatDiscount) {
            //This line might help in not give discount max than 20%
            const maxDiscount = (product.mrp / 100) * 20;
            if (flatDiscount <= maxDiscount) {
                product.price = product.mrp - flatDiscount;
                await product.save();
            }
        }
        res.json({ message: "Discount applied successfully", product });
    } catch (error) {
        res.status(500).json({
            payload: null,
            message: error.message || "An error occurred",
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log("Deleted productId", productId, req.body);

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product deleted successfully", product });
    } catch (error) {
        res.status(500).json({
            payload: null,
            message: error.message || "An error occurred",
        });
    }
};

const filterProductsByWeight = async (req, res) => {
    try {
        const { minWeight, maxWeight } = req.query;

        let query = {};

        if (minWeight && maxWeight) {
            query = { weight: { $gte: minWeight, $lte: maxWeight } };
        } else if (minWeight) {
            query = { weight: { $gte: minWeight } };
        } else if (maxWeight) {
            query = { weight: { $lte: maxWeight } };
        }

        const products = await Product.find(query).populate("category", "name");
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getAllCategories,
    getProductById,
    addProduct,
    editProduct,
    applyDiscount,
    addMultipleProducts,
    deleteProduct,
    filterProductsByWeight,
};
