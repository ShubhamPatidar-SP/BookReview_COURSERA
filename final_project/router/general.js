const express = require('express');
const User = require('../models/User.js');
const Book = require('../models/Book.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const public_users = express.Router();
require('dotenv').config();


const jwt_secret = process.env.JWT_SECRET;


public_users.post('/register', async (req, res) => {
  let success = false;
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(404).json({ success, error: "sorry this exist already !!!!!" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      email: req.body.email,
      password: secPass,
    });

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, jwt_secret);

    success = true;
    res.json({ success, authtoken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error is occured");
  }
})

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occurred");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const books = await Book.find({ isbn: isbn });

    if (books.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(books[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occurred");
  }
});


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    const books = await Book.find({ author: author });

    if (books.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(books[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occurred");
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    const books = await Book.find({ title: title });

    if (books.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(books[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occurred");
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const books = await Book.find({ isbn: isbn });

    if (books.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(books[0].reviews);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occurred");
  }
});

module.exports.general = public_users;
