const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: { type: String, required: false },
  title: { type: String, required: true },
  author: { type: String, require: true },
  imageUrl: { type: String, required: false },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [{
     userId: { type: String, required: false },
     grade: { type: Number, required: false }
  }],
  averageRating: { type: Number, required: false },
});

module.exports = mongoose.model('Book', bookSchema);