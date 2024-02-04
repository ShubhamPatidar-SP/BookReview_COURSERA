const express = require('express');
const connectToMongo = require("./db");
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const auth = require('./middleware/auth.js');
require('dotenv').config();

connectToMongo();

const app = express();
const port = process.env.PORT;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", auth);

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(port, () => {
    console.log(`BookReview server listening at http://127.0.0.1:${port}`);
});
