const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const access = sequelize.define('access', {
    name: DataTypes.STRING
}, {
    schema: process.env.test_schema,
    timestamps: false
});

module.exports = access;