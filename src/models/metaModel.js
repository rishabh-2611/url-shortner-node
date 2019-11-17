const mongoose = require("mongoose");

const MetaSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true
  },
  meta: {
    type: Number
  }
});

module.exports = mongoose.model("meta", MetaSchema);