const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Role = sequelize.define('role', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    user: DataTypes.ARRAY(DataTypes.INTEGER),
    book: DataTypes.ARRAY(DataTypes.INTEGER),
    author: DataTypes.ARRAY(DataTypes.INTEGER),
    role: DataTypes.ARRAY(DataTypes.INTEGER),
    category: DataTypes.ARRAY(DataTypes.INTEGER),
    bookloan: DataTypes.ARRAY(DataTypes.INTEGER)
}, {
    schema: process.env.test_schema,
    timestamps: false
});


module.exports = Role;