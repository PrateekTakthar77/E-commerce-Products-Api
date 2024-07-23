const express = require("express");
const productController = require("../controllers/Products");
const router = express.Router();

// Fetch all products
router.get("/", productController.getAllProducts);

//ferch all category
router.get("/categories", productController.getAllCategories);

//Fetch one product by Id

router.get("/:productId", productController.getProductById);

// Add a product (accessible to Dealer and Admin)
router.post("/", productController.addProduct);
// Add multiple products (accessible to Dealer and Admin)
router.post("/bulk", productController.addMultipleProducts);

// Edit a product (accessible to Dealer and Admin)
router.patch("/:productId", productController.editProduct);

// Apply discount to a product (accessible to Dealer and Admin)
router.patch("/:productId/discount", productController.applyDiscount);

//Apply delete a product (accessible to Dealer and Admin)
router.delete("/delete", productController.deleteProduct);

module.exports = router;
