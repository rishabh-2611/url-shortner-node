const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
  shortUrl: { type: String, required: true },
  timestamp: { type: String, required: true },
});

module.exports = mongoose.model("visit", VisitSchema);