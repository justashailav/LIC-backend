import { uploadMedia } from "../config/cloudinary.js";
import { Plan } from "../models/planCategory.js";
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(plans);
  } catch (error) {
    console.error("Get all plans error:", error);
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};
export const getPlanBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const plan = await Plan.findOne({
      slug,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error("Get plan by slug error:", error);
    res.status(500).json({ message: "Failed to fetch plan details" });
  }
};
export const getPopularPlans = async (req, res) => {
  try {
    const popularPlans = await Plan.find({
      isActive: true,
      isPopular: true,
    }).sort({ order: 1 });

    res.status(200).json(popularPlans);
  } catch (error) {
    console.error("Get popular plans error:", error);
    res.status(500).json({ message: "Failed to fetch popular plans" });
  }
};


export const createPlan = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      category, // ✅ ADD THIS
      benefits,
      whoShouldBuy,
      order,
      isPopular = false,
      popularLabel,
      popularValue,
      popularButtonText,
      popularBg,
    } = req.body;

    // ✅ Check required category
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const existingPlan = await Plan.findOne({ slug });
    if (existingPlan) {
      return res.status(400).json({ message: "Plan already exists" });
    }

    // ✅ Require Image
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // 🔥 Upload to Cloudinary
    const uploadedImage = await uploadMedia(req.file.path);
    const imageUrl = uploadedImage.secure_url;

    // ✅ Parse arrays safely
    const benefitsParsed =
      typeof benefits === "string" ? JSON.parse(benefits) : benefits;

    const whoShouldBuyParsed =
      typeof whoShouldBuy === "string"
        ? JSON.parse(whoShouldBuy)
        : whoShouldBuy;

    const newPlan = await Plan.create({
      title,
      slug,
      description,
      category, // ✅ SAVE CATEGORY
      benefits: benefitsParsed,
      whoShouldBuy: whoShouldBuyParsed,
      order,
      isPopular,
      popularLabel,
      popularValue,
      popularButtonText,
      popularBg,
      image: imageUrl,
    });

    res.status(201).json(newPlan);
  } catch (error) {
    console.error("Create plan error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    let imageUrl = plan.image;

    // ✅ If new image uploaded
    if (req.file) {
      const uploadedImage = await uploadMedia(req.file.path);
      imageUrl = uploadedImage.secure_url;
    }

    // ✅ Parse benefits safely
    const benefitsParsed =
      typeof req.body.benefits === "string"
        ? JSON.parse(req.body.benefits)
        : req.body.benefits;

    const whoShouldBuyParsed =
      typeof req.body.whoShouldBuy === "string"
        ? JSON.parse(req.body.whoShouldBuy)
        : req.body.whoShouldBuy;

    // ✅ Safe category handling (VERY IMPORTANT)
    const allowedCategories = [
      "Endowment Plan",
      "Money Back Plan",
      "Children Plan",
      "Single Premium Plan",
      "Term Insurance Plan",
      "Health Plan",
      "Pension Plan",
    ];

    let categoryValue = plan.category; // keep old by default

    if (req.body.category) {
      const trimmedCategory = req.body.category.trim();

      if (!allowedCategories.includes(trimmedCategory)) {
        return res.status(400).json({
          message: `Invalid category: ${trimmedCategory}`,
        });
      }

      categoryValue = trimmedCategory;
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        category: categoryValue,
        benefits: benefitsParsed,
        whoShouldBuy: whoShouldBuyParsed,
        order: req.body.order,
        isPopular: req.body.isPopular,
        popularLabel: req.body.popularLabel,
        popularValue: req.body.popularValue,
        popularButtonText: req.body.popularButtonText,
        popularBg: req.body.popularBg,
        image: imageUrl,
      },
      {
        new: true,
        runValidators: true, // keep this ON
      }
    );

    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Update plan error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const deletePlan = async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error("Delete plan error:", error);
    res.status(500).json({ message: "Failed to delete plan" });
  }
};
