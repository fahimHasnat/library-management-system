const Role = require('../models/Role');
const User = require('../models/User');
const { requiredError } = require('../services/requiredError');
const AuditLog = require('../util/audit');

/**
 * View role list
 */
exports.getRoleList = async (req, res, next) => {
    try {

        const roles = await Role.findAll();

        AuditLog.postAuditLog(req, "roles", "viewAll");

        res.status(200).json({ roles });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

/**
 * Add a new role
 * Restrict adding if the role already exists
 */
exports.addRole = async (req, res, next) => {
    try {

        const { name } = req.body;

        if (name) {

            const isExist = await Role.findOne({
                where: {
                    name: name
                }
            });

            if (isExist) {
                res.status(409).json({ message: 'Role Already Exists!!' })

            } else {
                const newRole = await Role.create({
                    ...req.body
                });

                if (!newRole) {
                    const error = new Error('Role not added!!');
                    error.statusCode = 500;
                    error.data = null;
                    throw error;
                }

                AuditLog.postAuditLog(req, "role", "create");

                res.status(201).json({ message: 'Role Added Successfully', role: newRole });
            }

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

/**
 * Update a role
 */
exports.updateRole = async (req, res, next) => {
    try {

        const { role_id } = req.body;

        if (role_id) {
            const updateRole = await Role.update({
                ...req.body
            }, {
                where: {
                    id: role_id
                }
            });

            if (updateRole[0] == 0) {
                const error = new Error('Role not updated!!');
                error.statusCode = 404;
                error.data = null;
                throw error;
            }

            AuditLog.postAuditLog(req, "role", "update");

            res.status(200).json({ message: 'Role Updated Successfully' })
        }
        else {
            requiredError(
                ["role_id"],
                req.body);
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

/**
 * Delete a role
 * Restrict deleting if a user is assigned to this role
 */
exports.deleteRole = async (req, res, next) => {
    try {
        const deleteRole = await Role.destroy(
            {
                where: {
                    id: req.params.id
                }
            });

        if (deleteRole == 0) {
            const error = new Error("Can't delete this role!!");
            error.statusCode = 500;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "role", "delete");

        res.status(200).json({ message: 'Role Deleted Successfully' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

/**
 * Assign a role to a user
 */
exports.assignRole = async (req, res, next) => {
    try {
        const { role_id, user_id } = req.body;
        if (role_id && user_id) {
            const assignRole = await User.update({ role_id }, {
                where: {
                    id: user_id
                }
            });

            if (assignRole[0] == 0) {
                const error = new Error("Can't assign this role!!");
                error.statusCode = 500;
                error.data = null;
                throw error;
            }

            AuditLog.postAuditLog(req, "role", "assign");

            res.status(200).json({ message: 'Role Assigned Successfully' });
        } else {
            requiredError(
                ["role_id", "user_id"],
                req.body);
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
