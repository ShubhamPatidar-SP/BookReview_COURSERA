const mongoose = require("mongoose");
require('dotenv').config();

const mongoURL = process.env.MONGO_URL

// arrow function for the connection setup to the mongodb using mongoose
const connectToNongo = () => {
    mongoose.connect(mongoURL);
}

module.exports = connectToNongo;