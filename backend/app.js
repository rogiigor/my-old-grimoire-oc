const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const bookRoutes = require('./routes/book');
const meberRoutes = require('./routes/member');

const app = express();

// mongoose.connect('mongodb+srv://igorvish_db_user:t3BOGSzsi6A6Pzy6@cluster0.qpbqu6v.mongodb.net/?appName=Cluster0')
mongoose.connect('mongodb://localhost:27017/mongoDbLocal2026')
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

// app.use('/api/books', bookRoutes);
app.use('/api/auth', meberRoutes);

module.exports = app;