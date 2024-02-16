const express = require('express');
const User = require('../models/User.js');
const Book = require('../models/Book.js');
const regd_users = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/auth.js');
const session = require('express-session');

const JWT_SECRET = process.env.JWT_SECRET;

regd_users.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));


const isValid = async (email) => { //returns boolean
  const found = await User.findOne({ email });
  if (found) {
    return true;
  }
  return false;
}

const authenticatedUser = async (email, password) => { //returns boolean
  const user = await User.findOne({ email })
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return false;
  }
  return true;
}

//only registered users can login
regd_users.post('/login', async (req, res) => {
  let success = false;
  const { email, password } = req.body;
  try {
    let userCompare = isValid(email);
    if (!userCompare) {
      return res.status(404).json({ error: " Wrong credential! enter correct email or password " });
    }

    const passwordCompare = authenticatedUser(email, password);
    if (!passwordCompare) {
      return res.status(404).json({ success, error: " Wrong credential! enter correct email or password " });
    }

    const user = await User.findOne({ email })

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    req.session.token = authtoken;
    res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error is occured");
  }
});


regd_users.put("/auth/review/:isbn", fetchuser, async (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const token = req.session.token;

  try {
    if (!token) {
      return res.status(404).json({ error: 'User need to Login first' });
    }
    const { id: userId } = jwt.decode(token).user;

    let book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const existingReviews = book.reviews || new Map();
    existingReviews.set(userId, review);
    await Book.updateOne({ isbn }, { $set: { reviews: existingReviews } });

    res.status(200).json({ message: 'Review updated/added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

regd_users.delete("/auth/review/:isbn", fetchuser, async (req, res) => {
  const { isbn } = req.params;
  const token = req.session.token;

  try {
    if (!token) {
      return res.status(404).json({ error: 'User need to Login first' });
    }
    const { id: userId } = jwt.decode(token).user;

    // Find the book
    let book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if the user has a review for this book
    if (!book.reviews || !book.reviews.has(userId)) {
      return res.status(404).json({ error: 'Review not found for this user and book' });
    }

    book.reviews.delete(userId);
    await Book.updateOne({ isbn }, { $set: { reviews: book.reviews } });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;