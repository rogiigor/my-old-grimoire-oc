const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb://localhost:27017/grimoireBookstoreDb')
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((error) => {
    console.log('MongoDB connection failed!');
    console.error(error);
});


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);


module.exports = app;