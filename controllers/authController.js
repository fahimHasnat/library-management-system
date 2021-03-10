const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const AuditLog = require('../util/audit');

exports.postLogin = async (req, res, next) => {
    try {
        const { username, pass } = req.body;

        const user = await User.findOne({
            where: {
                username
            }
        });

        if (!user) {
            const error = new Error("This Account Doesn't Exist");
            error.statusCode = 404;
            error.data = [];
            throw error;
        }

        if (user.active_status != true) {
            const error = new Error('Sorry. Your account is deactivated');
            error.statusCode = 404;
            error.data = user;
            throw error;
        }

        const isEqual = await bcrypt.compare(pass, user.pass);

        if (!isEqual) {
            const error = new Error("User ID or Password is incorrect.!");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role_id
            },
            process.env.TokenCode,
            { expiresIn: "8h" }
        );

        const roleAccess = await Role.findByPk(user.role_id);

        // AuditLog.postAuditLog(req, "web", "login");
        AuditLog.postAuditLog({ user: { id: user.id }, useragent: { browser: req.useragent.browser } }, "web", "login");


        res.status(200).json({
            token: token,
            id: user.id,
            username: user.username,
            role: user.role_id,
            access: {
                user: roleAccess.user,
                book: roleAccess.book,
                author: roleAccess.author,
                category: roleAccess.category,
                role: roleAccess.role
            }
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};