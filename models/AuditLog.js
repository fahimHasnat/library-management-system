const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const AuditLog = sequelize.define('audit_log', {
    user_id: Sequelize.INTEGER,
    ip_address: Sequelize.STRING,
    browser: Sequelize.STRING,
    resource: Sequelize.STRING,
    action: Sequelize.STRING
}, {
    schema: process.env.schema,
});

module.exports = AuditLog;