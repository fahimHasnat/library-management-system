const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Role = require('../models/Role');

const User = sequelize.define('user', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    pass: { type: DataTypes.STRING, allowNull: false },
    full_name: { type: DataTypes.STRING, allowNull: false },
    contact_no: { type: DataTypes.INTEGER, allowNull: false },
    dob: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    address: DataTypes.STRING,
    role_id: {
        type: DataTypes.INTEGER, allowNull: false, references: {
            model: {
                tableName: 'roles',
                schema: process.env.schema,
            },
            key: 'id',
        }
    },
    profile_pic: DataTypes.STRING,
    active_status: DataTypes.BOOLEAN
}, {
    schema: process.env.test_schema
});

// User.hasOne(Role, { foreignKey: 'id' });
// Role.belongsTo(User, { foreignKey: 'role_id' });
// Role.hasOne(User, { foreignKey: 'role_id' });

module.exports = User;