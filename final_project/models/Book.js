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
        type: Object,
        default: {}
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;