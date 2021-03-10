const Author = require('../models/Author');
const { requiredError } = require('../services/requiredError');
const AuditLog = require('../util/audit');
const Book = require('../models/Book');
const { Op } = require('sequelize');

exports.addAuthor = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (name) {
            const newAuthor = await Author.create({
                name
            });

            if (!newAuthor) {
                const error = new Error('Author not added!!');
                error.statusCode = 404;
                error.data = null;
                throw error;
            }

            AuditLog.postAuditLog(req, "author", "create");

            res.status(201).json({ message: 'Author Added Successfully', author: newAuthor })
        }

        else {
            requiredError(
                ["name"],
                req.body);
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateAuthor = async (req, res, next) => {
    try {
        const { author_id, name } = req.body;

        if (author_id) {
            const updateAuthor = await Author.update({
                name
            }, {
                where: {
                    id: author_id
                }
            });

            if (updateAuthor[0] == 0) {
                const error = new Error('Author not updated!!');
                error.statusCode = 404;
                error.data = null;
                throw error;
            }

            AuditLog.postAuditLog(req, "author", "update");

            res.status(200).json({ message: 'Author Updated Successfully' })
        }

        else {
            requiredError(
                ["author_id"],
                req.body);
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteAuthor = async (req, res, next) => {
    try {
        const exist = await Book.findOne({
            where: {
                author: { [Op.contains]: [req.params.id] }
            }
        });

        if (exist) {
            const error = new Error("Books exist written by this author!!");
            error.statusCode = 409;
            error.data = null;
            throw error;
        }
        const deleteAuthor = await Author.destroy({
            where: {
                id: req.params.id
            }
        });

        if (deleteAuthor == 0) {
            const error = new Error("Can't delete this Author!!");
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "author", "delete");

        res.status(200).json({ message: 'Author Deleted Successfully' })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getAuthors = async (req, res, next) => {
    try {
        const authors = await Author.findAll();

        AuditLog.postAuditLog(req, "author", "viewAll");

        res.status(200).json({ authors });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}