// Author Model

// Initialise Mongoose Connection for MongoDB
const mongoose = require("mongoose");

// Get a Book object for the constraint check
const Book = require("./book");

// Create Author Schema (Table)
const authorSchema = new mongoose.Schema( {
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre("remove", function (next) {
  Book.find({ authorId: this.id }, (err, books) => {
    if (err) {  // Error opening Books
      next(err);
    } else if (books.length > 0) {  // Book found for author
      next(new Error("Error - This author still has books."));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Author", authorSchema);

