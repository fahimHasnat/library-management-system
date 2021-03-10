const User = require('../models/User');
const { requiredError } = require('../services/requiredError');
const bcrypt = require('bcryptjs');
const AuditLog = require('../util/audit');
const BookLoan = require('../models/BookLoan');

/**
 * Upload a picture
 */
exports.uploadPic = async (req, res, next) => {
    try {

        if (req.fileValidationError) {
            res.status(403).send(req.fileValidationError);
        }
        else if (!req.file) {
            res.status(403).send({ message: 'Please select an image to upload' });
        }

        res.status(200).send({ filename: req.file.filename });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

/**
 * Add a new user
 * Restrict adding if the username already exists
 */
exports.addUser = async (req, res, next) => {
    try {

        const { username, pass, full_name, contact_no } = req.body;

        if (username && pass && full_name && contact_no) {

            const user = await User.findOne({ where: { username: username } });

            if (user) {
                res.status(409).json({ message: 'Username Already Exist!!' });
            } else {
                const newUser = await User.create({
                    ...req.body,
                    pass: await bcrypt.hash(pass, 12),
                    active_status: true
                });

                if (!newUser) {
                    const error = new Error('User not created!!');
                    error.statusCode = 404;
                    error.data = null;
                    throw error;
                }
                res.status(201).json({ message: 'User Created Successfully', user: newUser });
            }

        } else {
            requiredError(
                ["username", "pass", "full_name", "contact_no"],
                req.body);
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

/**
 * Update a new user
 * Restrict updating if the username already exists
 */
exports.updateUser = async (req, res, next) => {
    try {

        const updatedUser = await User.update({
            ...req.body
        }, {
            where: {
                id: req.user.id
            }
        });

        if (updatedUser[0] == 0) {
            const error = new Error('User not updated!!');
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "user", "update");

        res.status(200).json({ message: 'User Updated Successfully' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

/**
 * Deactivate own account
 */
exports.deactivateUser = async (req, res, next) => {
    try {

        const bookLoan = await BookLoan.findOne({
            where: {
                user_id: req.user.id,
                status: 4
            }
        });

        if (bookLoan) {
            const error = new Error("You can't deactivate without clearing book loans!!");
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        const updatedUser = await User.update({
            active_status: false
        }, {
            where: {
                id: req.user.id
            }
        });

        if (updatedUser[0] == 0) {
            const error = new Error('User not updated!!');
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "user", "deactivate");

        res.status(200).json({ message: 'User Updated Successfully' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

/**
 * Get the user list
 */
exports.getUserList = async (req, res, next) => {
    try {

        const users = await User.findAll({
            attributes: { exclude: ["pass", "createdAt", "updatedAt"] }
        });
        AuditLog.postAuditLog(req, "user", "viewAll");

        res.status(200).json({ users });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

/**
 * Activate an User
 */
exports.activateUser = async (req, res, next) => {
    try {

        const updatedUser = await User.update({
            active_status: true
        }, {
            where: {
                id: req.params.id
            }
        });

        if (updatedUser[0] == 0) {
            const error = new Error('User not updated!!');
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "user", "activate");

        res.status(200).json({ message: 'User Updated Successfully' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

/**
 * Get a user by id
 */
exports.getUser = async (req, res, next) => {
    try {

        const user = await User.findByPk(req.params.id);

        if (!user) {
            const error = new Error('User not found!!');
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "user", "viewOne");

        res.status(200).json({ user });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

/**
 * Get own user profile
 */
exports.getProfile = async (req, res, next) => {
    try {

        const user = await User.findByPk(req.user.id);

        if (!user) {
            const error = new Error('User not found!!');
            error.statusCode = 404;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "user", "viewProfile");

        res.status(200).json({ user });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};