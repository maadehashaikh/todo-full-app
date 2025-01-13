const mongoose = require("mongoose");
const todoSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
  priority: {
    type: String,
  },
  category: {
    type: String,
  },
  status: {
    type: String,
  },
  date: {
    type: Number,
    default: Date.now(),
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming your User model is named "User"
    required: true, // Ensure every to-do is associated with a user
  },
});

module.exports = mongoose.model("Todo", todoSchema);
