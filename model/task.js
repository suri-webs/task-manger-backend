const mongoose = require("mongoose");
const { Schema } = mongoose;
const taskSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedAt: Date,
    lastCompletionDate: Date,
    personDoing: {
      type: String,
      required: true,
    },
    completedAt: {
      type: Date,
      optional: true,
    },
    deletedAt: {
      type: Date,
      optional: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "deleted"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;
