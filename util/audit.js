const AuditLog = require('../models/AuditLog');
const axios = require('axios');

exports.postAuditLog = async (req, resource, action) => {
    try {

        const browser = req.useragent.browser;

        let ip_address;
        await axios.get('https://api.ipify.org/?format=json')
            .then(function (response) {
                ip_address = response.data.ip;
            })
            .catch(function (error) {
                // console.log(error);
            });

        const auditLog = await AuditLog.create({ user_id: req.user.id, action, resource, ip_address, browser });

        if (!auditLog) {
            const error = new Error('Audit Log Entry Error!!');
            error.statusCode = 404;
            error.data = auditLog;
            throw error;
        }

    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        throw error;
    }

};