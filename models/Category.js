const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const category = sequelize.define('category', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
    schema: process.env.test_schema,
    timestamps: false
});

module.exports = category;