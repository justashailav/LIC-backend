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
      benefits,
      whoShouldBuy,
      order,
      isPopular = false,
      popularLabel,
      popularValue,
      popularButtonText,
      popularBg,
    } = req.body;

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
    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Update plan error:", error);
    res.status(500).json({ message: "Failed to update plan" });
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
