const express = require("express");
const router = express.Router();
const Category = require("../model/category");

// Add category
router.post("/add-category", async (req, res) => {
  try {
    const { categoryName } = req.body;

    // Validate request body
    if (!categoryName || typeof categoryName !== "string" || categoryName.trim() === "") {
      return res.status(400).json({ message: "Invalid category name." });
    }

    const trimmedCategoryName = categoryName.trim();

    // Check if category already exists
    const existingCat = await Category.findOne({ categoryName: trimmedCategoryName });
    if (existingCat) {
      return res.status(409).json({ message: `Category '${trimmedCategoryName}' already exists.` });
    }

    // Create and save new category
    const newCategory = new Category({ categoryName: trimmedCategoryName });
    await newCategory.save();

    return res.status(201).json({ 
      message: `Category '${trimmedCategoryName}' created successfully.`,
      category: newCategory 
    });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ 
      message: "Internal server error.",
      error: error.message 
    });
  }
});

module.exports = router;
