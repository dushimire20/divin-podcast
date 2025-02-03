const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const Joi = require("joi");
const Category = require("../model/category");
const Podcast = require("../model/podcast");
const User = require("../model/user");
const router = express.Router();

// Utility: Error response handler
const handleError = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, message });
};

// Validation schemas
const podcastSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(), // category as string now
});

// Add podcast
router.post(
  "/add-podcast",
  authenticateToken,
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Validate request body
      const { error } = podcastSchema.validate(req.body);
      if (error) return handleError(res, 400, error.details[0].message);

      // Validate uploaded files
      const frontImage = req.files?.frontImage?.[0]?.path;
      const audioFile = req.files?.audioFile?.[0]?.path;
      if (!frontImage || !audioFile) {
        return handleError(res, 400, "Both frontImage and audioFile are required.");
      }

      // Retrieve user from the request
      const user = req.user;
      if (!user) return handleError(res, 401, "Unauthorized. Please log in.");

      // Check if category exists
      const cat = await Category.findOne({ categoryName: req.body.category });
      if (!cat) return handleError(res, 400, `Category '${req.body.category}' does not exist.`);

      // Create and save the new podcast
      const newPodcast = new Podcast({
        frontImage,
        audioFile,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category, // Use category as string now
        user: user._id,
      });

      await newPodcast.save();

      // Update related collections
      await Promise.all([
        Category.findByIdAndUpdate(cat._id, { $push: { podcasts: newPodcast._id } }),
        User.findByIdAndUpdate(user._id, { $push: { podcasts: newPodcast._id } }),
      ]);

      res.status(201).json({
        success: true,
        message: "Podcast added successfully!",
        data: newPodcast,
      });
    } catch (error) {
      console.error("Error adding podcast:", error);
      handleError(res, 500, "Failed to add podcast.");
    }
  }
);

// Get all podcasts (with pagination)
router.get("/get-podcasts", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const podcasts = await Podcast.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Podcast.countDocuments();

    res.status(200).json({
      success: true,
      data: podcasts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    handleError(res, 500, "Internal server error.");
  }
});

// Get user podcasts
router.get("/get-user-podcasts", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const userId = user._id;
    const data = await User.findById(userId)
      .populate({
        path: "podcasts",
        // No need to populate category since it is a string now
      })
      .select("-password");
    if (data && data.podcasts) {
      data.podcasts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.status(200).json({ success: true, data: data.podcasts });
  } catch (error) {
    console.error("Error fetching user podcasts:", error);
    handleError(res, 500, "Internal server error.");
  }
});

// Get individual podcast
router.get("/get-podcast/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const podcast = await Podcast.findById(id); // No need to populate category
    if (!podcast) return handleError(res, 404, "Podcast not found.");
    res.status(200).json({ success: true, data: podcast });
  } catch (error) {
    console.error("Error fetching podcast:", error);
    handleError(res, 500, "Internal server error.");
  }
});

// Get podcasts by category
router.get("/category/:cat", async (req, res) => {
  try {
    const { cat } = req.params;
    const podcasts = await Podcast.find({ category: cat }); // Match by category name string
    if (!podcasts.length) return handleError(res, 404, "No podcasts found for this category.");
    res.status(200).json({ success: true, data: podcasts });
  } catch (error) {
    console.error("Error fetching podcasts by category:", error);
    handleError(res, 500, "Internal server error.");
  }
});

module.exports = router;
