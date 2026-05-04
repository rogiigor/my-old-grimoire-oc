const book = require('../models/book');
const Book = require('../models/book');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

exports.createBook = async (req, res, next) => {
    req.body.book = JSON.parse(req.body.book);
    const url = req.protocol + '://' + req.get('host');

    const bookData = req.body.book;
    const ratings = [];
    if (bookData.ratings &&
        bookData.ratings.length > 0 &&
        bookData.ratings[0].grade > 0) {
          ratings.push(
            { userId: bookData.ratings[0].userId, 
              grade: Number(bookData.ratings[0].grade)
            });
    }

    const averageRating = ratings.length > 0 ?
      ratings[0].grade : 0;

    const optimizedFileName = await optimizeImage(req);

    const book = new Book({
        userId: bookData.userId,
        title: bookData.title,
        author: bookData.author,
        imageUrl: url + '/images/' + optimizedFileName,
        year: bookData.year,
        genre: bookData.genre,
        ratings: ratings,
        averageRating: averageRating

    });
    book.save()
    .then(() => res.status(201).json({ message: 'Book saved successfully!'}))
    .catch((error) => res.status(400).json({ error: error }))
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(404).json({ error: error }))
};

exports.modifyBook = async (req, res, next) => {
    let book = new Book({ _id: req.params._id});
    if (req.file) {
       req.body.book = JSON.parse(req.body.book);
       const url = req.protocol + '://' + req.get('host');
       const optimizedFileName = await optimizeImage(req);
       book = {
          _id: req.params.id,
          userId: req.body.book.userId,
          title: req.body.book.title,
          author: req.body.book.author,
          imageUrl: url + '/images/' + optimizedFileName,
          year: req.body.book.year,
          genre: req.body.book.genre
      };
    } else {
      book = {
        _id: req.params.id,
        userId: req.body.userId,
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        year: req.body.year,
        genre: req.body.genre
      };
    }
    Book.updateOne({ _id: req.params.id }, book)
    .then(() => res.status(200).json({ message: 'Book modified !'}))
    .catch(error => res.status(400).json({ error: error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({_id: req.params.id}).then(
    (book) => {
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Book deleted !'}))
          .catch(error => res.status(400).json({ error: error }));
      });
    }
  )
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
  .then(books => res.status(200).json(books))
  .catch(error => res.status(400).json({ error: error }))
};

exports.createRating = (req, res, next) => {
  const grade = Number(req.body.rating);

  if (isNaN(grade) || grade < 0 || grade > 5) {
    return res.status(400).json({ message: 'Invalid rating value' });
  }

  const rating = {userId: req.auth.userId, grade: grade };

  Book.findOne({_id: req.params.id}).then(
    (book) => {
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const userId = req.auth.userId;
      const myRatings = book.ratings
        .filter(rating => rating.userId.toString() === userId);

      if (myRatings.length > 0) {
        return res.status(400).json({ message: 'You have already rated this book !'});
      }


      book.ratings.push(rating);
      book.averageRating = book.ratings.reduce((acc, curr) => 
          acc + curr.grade, 0) / book.ratings.length;

      book.save()
          .then((updatedBook) => res.status(200).json(updatedBook))
          .catch(error => res.status(400).json({ error }));  
    })
    .catch(error => res.status(500).json({ error: error }));
};

exports.bestRating = (req, res, next) => {
  Book.find().then(
    (books) => {
      if (books.legth < 4) {
        return res.status(400).json({ message: 'Not enough books to determine best ratings' });
      }

      const sortedBooks = books.sort((a, b) => b.averageRating - a.averageRating);
      const bestRated = sortedBooks.slice(0, 3);
      res.status(200).json(bestRated);
    }).catch(error => res.status(400).json({ error: error }));
};

async function optimizeImage(req) {
  const originalFilePath = req.file.path;
  const optimizedFileName = 'optimized_' + req.file.filename
    .split('.')[0] + '.webp';
  const optimizedFilePath = 'images/' + optimizedFileName;

  await sharp(originalFilePath)
    .webp({
      quality: 76,
      effore: 6,
      lossless: false,
      nearLosless: false
    })
    .toFile(optimizedFilePath);
  fs.unlinkSync(originalFilePath);
  return optimizedFileName;
}

