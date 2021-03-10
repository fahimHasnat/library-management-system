const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const BookLoan = require('./BookLoan');

const Book = sequelize.define('book', {
    title: { type: DataTypes.STRING, allowNull: false },
    publication_year: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
    total: { type: DataTypes.INTEGER, allowNull: false },
    current: DataTypes.INTEGER,
    author: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false }
}, {
    schema: process.env.test_schema,
    indexes: [
        {
            unique: true,
            name: 'unique_book',
            using: 'BTREE',
            fields: ['title', 'publication_year', 'author']
        }
    ]
});

Book.hasMany(BookLoan, { foreignKey: 'book_id' });

module.exports = Book;