const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    reviews: {
        type: Map,
        of: String,
        default: new Map()
    }
});

const Book = mongoose.model('books', bookSchema);

module.exports = Book;