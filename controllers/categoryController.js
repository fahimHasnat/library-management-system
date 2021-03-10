const Category = require('../models/Category');
const { requiredError } = require('../services/requiredError');
const AuditLog = require('../util/audit');

exports.getCategoryList = async (req, res, next) => {
    try {

        const categories = await Category.findAll();

        AuditLog.postAuditLog(req, "category", "viewAll");

        res.status(200).json({ categories });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addCategory = async (req, res, next) => {
    try {

        const { name } = req.body;

        if (name) {

            const isExist = await Category.findOne({
                where: {
                    name: name
                }
            });

            if (isExist) {
                res.status(409).json({ message: 'Category Already Exists!!' })

            } else {
                const newCategory = await Category.create({
                    name
                });

                if (!newCategory) {
                    const error = new Error('Category not added!!');
                    error.statusCode = 500;
                    error.data = null;
                    throw error;
                }

                AuditLog.postAuditLog(req, "category", "create");

                res.status(201).json({ message: 'Category Added Successfully', category: newCategory });
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

exports.updateCategory = async (req, res, next) => {
    try {

        const { category_id, name } = req.body;

        if (category_id) {
            const category = await Category.findOne({
                where: {
                    name
                }
            });
            if (category) {
                res.status(409).json({ message: 'Category Already Exists!!' });
            } else {
                const updateCategory = await Category.update({
                    name
                }, {
                    where: {
                        id: category_id
                    }
                });

                if (updateCategory[0] == 0) {
                    const error = new Error('Category not updated!!');
                    error.statusCode = 404;
                    error.data = null;
                    throw error;
                }

                AuditLog.postAuditLog(req, "category", "update");

                res.status(200).json({ message: 'Category Updated Successfully' })
            }
        }
        else {
            requiredError(
                ["category_id"],
                req.body);
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const deleteCategory = await Category.destroy(
            {
                where: {
                    id: req.params.id
                }
            });

        if (deleteCategory == 0) {
            const error = new Error("Can't delete this category!!");
            error.statusCode = 500;
            error.data = null;
            throw error;
        }

        AuditLog.postAuditLog(req, "category", "delete");

        res.status(200).json({ message: 'Category Deleted Successfully' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}