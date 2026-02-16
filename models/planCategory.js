import mongoose from "mongoose";

const planCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },
     image: {
      type: String, // store image URL
      required: true,
    },
    benefits: {
      type: [String],
      default: [],
    },

    whoShouldBuy: {
      type: [String],
      default: [],
    },

    // 🔥 Popular plan support
    isPopular: {
      type: Boolean,
      default: false,
    },

    popularLabel: {
      type: String, // e.g. "Sum Assured", "Past Returns"
    },

    popularValue: {
      type: String, // e.g. "₹2 Crore", "24.3%"
    },

    popularButtonText: {
      type: String,
      default: "View Plans",
    },

    popularBg: {
      type: String, // e.g. "from-green-50 to-white"
      default: "from-gray-50 to-white",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Plan = mongoose.model("Plan", planCategorySchema);
