const Book = require('../models/book');

exports.createBook = (req, res, next) => {
    if (!req.body.book) {
        return res.status(400).json({ error: 'Missing book data' });
    }
    const bookData = JSON.parse(req.body.book);
    bookData.userId = req.auth.userId;

    const book = new Book(bookData);
    book.save()
    .then(() => res.status(201).json({ message: 'Book saved successfully!'}))
    .catch((error) => res.status(400).json({ error }))
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(404).json({ error }))
};

exports.modifyBook = (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Book modified !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Book deleted !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
  .then(books => res.status(200).json(books))
  .catch(error => res.status(400).json({ error }))
};