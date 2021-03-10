const express = require('express');
const bodyParser = require("body-parser");
const useragent = require('express-useragent');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./util/database');

const app = express();

///Routes
const Book = require('./routes/book');
const Author = require('./routes/author');
const Category = require('./routes/category');
const User = require('./routes/user');
const Auth = require('./routes/auth');
const BookLoan = require('./routes/bookLoan');
const Role = require('./routes/role');

///Middleware
app.use(bodyParser.json({ limit: '100mb' }));
app.use(useragent.express());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, responseType'
    );
    next();
});

///Routing Handler
app.use(Auth);
app.use('/book', Book);
app.use('/author', Author);
app.use('/category', Category);
app.use('/user', User);
app.use('/bookloan', BookLoan);
app.use('/role', Role);

///Error Handler
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

sequelize.sync()
    .then(() => {
        console.log('Connection has been established successfully.');
        app.listen(process.env.PORT || 8000, () => {
            console.log(`The server is running on port ${process.env.PORT || 8000} in ${process.env.STAGE} mode`);
        });
    })
    .catch(err => {
        console.error(`Unable to connect to the database in ${process.env.STAGE} mode:`, err);
    });

module.exports = app;