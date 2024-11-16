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
});

module.exports = mongoose.model("Todo", todoSchema);
