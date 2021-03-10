// const sequelize = require('../../util/database');
const Book = require('../models/Book');
const Fuse = require('fuse.js');
const sequelize = require('../util/database');
const axios = require('axios');
const { requiredError } = require('../services/requiredError');
const AuditLog = require('../util/audit');
const BookLoan = require('../models/BookLoan');

exports.addBook = async (req, res, next) => {
    try {

        const { title, category, total, author, publication_year } = req.body;

        if (title && category && author && total && publication_year) {
            const book = await Book.findOne({
                where: {
                    title,
                    publication_year,
                    author
                }
            });

            if (book) {
                res.status(409).json({ message: 'Book already exists!!' })
            } else {
                const newBook = await Book.create({
                    ...req.body,
                    current: total
                });

                if (!newBook) {
                    const error = new Error('Book not added!!');
                    error.statusCode = 404;
                    error.data = null;
                    throw error;
                }

                AuditLog.postAuditLog(req, "book", "create");

                res.status(201).json({ message: 'Book Added Successfully', book: newBook });
            }
        }
        else {
            requiredError(
                ["title", "category", "author", "total", "publication_year"],
                req.body);
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateBook = async (req, res, next) => {
    try {

        const { book_id } = req.body;

        if (book_id) {
            const updateBook = await Book.update({
                ...req.body
            }, {
                where: {
                    id: book_id
                }
            });

            if (updateBook[0] == 0) {
                const error = new Error('Book details not updated!!');
                error.statusCode = 404;
                error.data = null;
                throw error;
            }

            AuditLog.postAuditLog(req, "book", "update");

            res.status(200).json({ message: 'Book Updated Successfully' })
        }
        else {
            requiredError(
                ["book_id"],
                req.body);
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteBook = async (req, res, next) => {
    try {

        const bookLoan = await BookLoan.findOne({
            where: {
                book_id: req.params.id,
                status: 4
            }
        });

        if (bookLoan) {
            const error = new Error("This book is loaned. Can't delete this book!!");
            error.statusCode = 409;
            error.data = null;
            throw error;
        }

        const deleteBook = await Book.destroy(
            {
                where: {
                    id: req.params.id
                }
            });

        if (deleteBook == 0) {
            const error = new Error("Can't delete this book!!");
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "book", "delete");

        res.status(200).json({ message: 'Book Deleted Successfully' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getBooks = async (req, res, next) => {
    try {

        const offset = req.query.page ? (req.query.page - 1) * 10 : 0;

        const books = await sequelize.query(`
        SELECT
            b.id,
            b.title,
            b.publication_year,
            array_agg(distinct(c.name)) as "category",
            b.total,
            b."current",
            array_agg(distinct(a.name)) as "authors"
        FROM
            books b,
            categories c,
            authors a
        WHERE
            b.category && ARRAY[c.id]
            and b.author && ARRAY [a.id]
        group by
            b.id,
            b.title,
            b.publication_year,
            b.total,
            b."current"
        ORDER BY
            b.title ASC
        OFFSET ${offset}
        LIMIT 10
        `);

        res.status(200).json({ books: books[0] });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getBook = async (req, res, next) => {
    try {
        const book = await sequelize.query(`
        SELECT
            b.id,
            b.title,
            b.publication_year,
            array_agg(distinct(c.name)) as "category",
            b.total,
            b."current",
            array_agg(distinct(a.name)) as "authors"
        FROM
            books b,
            categories c,
            authors a
        WHERE
            b.id = ${req.params.id}
            and b.category && ARRAY[c.id]
            and b.author && ARRAY [a.id]
        group by
            b.id,
            b.title,
            b.publication_year,
            b.total,
            b."current"
        `);

        if (book[0].length == 0) {
            const error = new Error("No User Found!!");
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "book", "viewOne");

        res.status(200).json({ book: book[0][0] });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.search = async (req, res, next) => {
    try {

        console.log(req.params.title);

        const { data } = await axios.get('http://localhost:8000/book/books');

        const fuse = new Fuse(data.books, {
            keys: ['title', 'category', 'authors']
        });

        res.status(200).json({ result: fuse.search(req.params.title) });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

