const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Book = require('./Book');

const BookLoan = sequelize.define('book-loan', {
    book_id: {
        type: DataTypes.INTEGER, allowNull: false, onDelete: 'CASCADE', references: {
            model: {
                tableName: 'books',
                schema: process.env.schema,
            },
            key: 'id',
        }
    },
    user_id: {
        type: DataTypes.INTEGER, allowNull: false, references: {
            model: {
                tableName: 'users',
                schema: process.env.schema,
            },
            key: 'id',
        }
    },
    from_date: { type: DataTypes.DATEONLY, allowNull: false },
    to_date: { type: DataTypes.DATEONLY, allowNull: false },
    issued_by: DataTypes.INTEGER,
    status: { type: DataTypes.INTEGER, allowNull: false }
}, {
    schema: process.env.test_schema
});

module.exports = BookLoan;