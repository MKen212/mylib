// Book Model

// Initialise Mongoose Connection for MongoDB
const mongoose = require("mongoose");

// Create Book Schema (Table)
const bookSchema = new mongoose.Schema( {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  imageData: {
    type: Buffer,
    required: true,
  },
  imageType: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

bookSchema.virtual("image").get(function () {
  if (this.imageData != null && this.imageType != null) {
    return `data:${this.imageType};charset=utf-8;base64,${this.imageData.toString("base64")}`;
    
  }
});

module.exports = mongoose.model("Book", bookSchema);
