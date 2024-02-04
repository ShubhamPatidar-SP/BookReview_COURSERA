const mongoose = require("mongoose");

const mongoURL = "mongodb://localhost:27017/BookReview?"

// arrow function for the connection setup to the mongodb using mongoose
const connectToNongo = () => {
    mongoose.connect(mongoURL);
}

module.exports = connectToNongo;