const Role = require('../models/Role');
const { Op } = require('sequelize');

module.exports = function (action, resource) {
    return async (req, res, next) => {
        try {
            const permission = await Role.findOne({
                where: {
                    id: req.user.role,
                    [resource]: { [Op.overlap]: [action] }
                }
            });

            if (!permission) {
                const error = new Error("Not Permitted!");
                error.statusCode = 401;
                throw error;
            }

            next();
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error)
        }
    }
}