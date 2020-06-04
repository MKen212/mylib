// Author Model

// Initialise Mongoose Connection for MongoDB
const mongoose = require("mongoose");

// Create Author Schema (Table)
const authorSchema = new mongoose.Schema( {
  name: {
    type:  String,
    required: true
  }
});

module.exports = mongoose.model("Author", authorSchema);

