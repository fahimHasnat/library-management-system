const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.Db_Name, process.env.Db_user, process.env.Db_pass, {
    dialect: process.env.Db_dialect,
    logging: false,
    pool: {
        max: 50,
        min: 0,
        acquire: 600000,
        idle: 10000,
    }
});

module.exports = sequelize;