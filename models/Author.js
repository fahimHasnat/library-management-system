const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const author = sequelize.define('author', {
    name: { type: DataTypes.STRING, allowNull: false }
}, {
    schema: process.env.test_schema,
    timestamps: false
});

module.exports = author;