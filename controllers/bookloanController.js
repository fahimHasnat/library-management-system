// const sequelize = require('../../util/database');
const Book = require('../models/Book');
const BookLoan = require('../models/BookLoan');
const sequelize = require('../util/database');
const { requiredError } = require('../services/requiredError');
const AuditLog = require('../util/audit');
const reportGenerator = require('../util/report-generate');

const statusType = {
    "1": "requested",
    "2": "rejected",
    "3": "returned",
    "4": "accepted"
}

exports.requestBook = async (req, res, next) => {
    try {
        const { from_date, to_date, book_id } = req.body;
        if (book_id, from_date, to_date) {
            const book = await Book.findByPk(book_id);

            if (!book) {
                const error = new Error('Book not found!!');
                error.statusCode = 404;
                error.data = null;
                throw error;
            }

            const exist = await BookLoan.findOne({
                where: {
                    user_id: req.user.id,
                    status: [1, 4],
                    book_id
                }
            });

            if (exist) {
                const error = new Error('You already requested for this Book!!');
                error.statusCode = 409;
                error.data = null;
                throw error;
            }

            const newLoan = await BookLoan.create({
                ...req.body,
                status: 1,
                user_id: req.user.id
            });

            if (!newLoan) {
                const error = new Error("Database Error!!");
                error.statusCode = 500;
                error.data = null;
                throw error;
            }

            AuditLog.postAuditLog(req, "book-loan", "request");

            res.status(201).json({ message: 'Book Loan Request Complete' });
        } else {
            requiredError(
                ["book_id", "from_date", "to_date"],
                req.body);
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.rejectBookLoan = async (req, res, next) => {
    try {

        const bookLoan = await BookLoan.findByPk(req.params.id);

        if (!bookLoan) {
            const error = new Error('No Book Loan found!!');
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        const rejectLoan = await BookLoan.update({ status: 2, issued_by: req.user.id }, {
            where: {
                id: req.params.id
            }
        });

        if (rejectLoan[0] == 0) {
            const error = new Error("Database Error!!");
            error.statusCode = 500;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "book-loan", "reject");

        res.status(201).json({ message: 'Book Loan Successfully Updated' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.acceptBookLoan = async (req, res, next) => {
    try {

        const bookLoan = await BookLoan.findByPk(req.params.id);

        if (!bookLoan) {
            const error = new Error('No Book Loan found!!');
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        const acceptLoan = await BookLoan.update({ status: 4, issued_by: req.user.id }, {
            where: {
                id: req.params.id
            }
        });

        if (acceptLoan[0] == 0) {
            const error = new Error("Database Error!!");
            error.statusCode = 500;
            error.data = null;
            throw error;
        }

        // update current count in books table for this book
        const bookInfo = await Book.findByPk(bookLoan.book_id);

        await Book.update({ current: bookInfo.current - 1 }, { where: { id: bookInfo.id } })

        AuditLog.postAuditLog(req, "book-loan", "accept");

        res.status(201).json({ message: 'Book Loan Successfully Updated' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.returnBookLoan = async (req, res, next) => {
    try {

        const bookLoan = await BookLoan.findByPk(req.params.id);

        if (!bookLoan) {
            const error = new Error('No Book Loan found!!');
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        const returnLoan = await BookLoan.update({ status: 3, issued_by: req.user.id }, {
            where: {
                id: req.params.id
            }
        });

        if (returnLoan[0] == 0) {
            const error = new Error("Database Error!!");
            error.statusCode = 500;
            error.data = null;
            throw error;
        }

        // update current count in books table for this book
        const bookInfo = await Book.findByPk(bookLoan.book_id);

        await Book.update({ current: bookInfo.current + 1 }, { where: { id: bookInfo.id } })

        AuditLog.postAuditLog(req, "book-loan", "return");

        res.status(201).json({ message: 'Book Loan Successfully Updated' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.bookLoanExport = async (req, res, next) => {
    try {

        let book = await sequelize.query(`
        SELECT
            DISTINCT(b.title),
            b.total,
            b."current",
            u.username "loaned_to",
            bl.from_date,
            bl.to_date,
            bl.status,
            bl."createdAt" :: date,
            bl."updatedAt" :: date
        FROM
            "book-loans" bl,
            books b,
            users u,
            users u2
        WHERE
            bl.book_id = b.id
            and bl.user_id = u.id`);

        if (book[0].length == 0) {
            book = [];
        } else {
            book = book[0].map(x => {
                x.status = statusType[x.status];
                return x;
            });
        }

        AuditLog.postAuditLog(req, "book-loan", "export");

        res.status(200).send(await reportGenerator.generate(book));

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
