require('dotenv').config();
const Access = require('../models/Access');
const Role = require('../models/Role');
const User = require('../models/User');
const sequelize = require('../util/database');

let accessData = [
    { id: 1, name: 'create' },
    { id: 2, name: 'read' },
    { id: 3, name: 'update' },
    { id: 4, name: 'delete' },
    { id: 5, name: 'active' },
    { id: 6, name: 'deactivate' },
    { id: 7, name: 'reject' },
    { id: 8, name: 'approve' },
    { id: 9, name: 'return' },
    { id: 10, name: 'view others' },
    { id: 11, name: 'request' },
    { id: 12, name: 'reject' },
    { id: 13, name: 'accept' },
    { id: 14, name: 'return' },
    { id: 15, name: 'export' },
    { id: 16, name: 'assign' }
];

let roleData = [
    {
        name: 'Admin',
        user: [1, 2, 3, 4, 5, 6, 10],
        book: [1, 2, 3, 4],
        author: [1, 2, 3, 4],
        role: [1, 2, 3, 4, 16],
        category: [1, 2, 3, 4],
        bookloan: [2, 10, 11, 12, 13, 14, 15]
    },
    {
        name: 'User',
        user: [2, 3, 6],
        book: [2],
        author: [2],
        role: null,
        category: [2],
        bookloan: [2, 11]
    }
];

let userData = [
    {
        username: 'Admin',
        pass: '$2a$12$EdW2WA10cUybs7vi4H6HYOcSpSJFT.sOTwYFsC5Im7rgIJzvmLbm.',
        full_name: 'Admin User',
        contact_no: 170000000,
        dob: "2000-01-01",
        gender: "male",
        address: "banani",
        role_id: 1,
        profile_pic: null,
        active_status: true
    },
    {
        username: 'User',
        pass: '$2a$12$EdW2WA10cUybs7vi4H6HYOcSpSJFT.sOTwYFsC5Im7rgIJzvmLbm.',
        full_name: 'Normal User',
        contact_no: 17111111,
        dob: "2000-01-01",
        gender: "male",
        address: "banani",
        role_id: 2,
        profile_pic: null,
        active_status: true
    }
];


sequelize.sync()
    .then(() => {
        console.log('Seeder File is running. Wait a moment!!');
        Access.findAll().then(data => {
            if (data.length == 0) {
                Access.bulkCreate(accessData, {
                    fields: ["id", "name"]
                });
            }
        });

        Role.findAll().then(data => {
            if (data.length == 0) {
                Role.bulkCreate(roleData, {
                    fields: ["name", "user", "book", "author", "role", "category", "bookloan"]
                });
            }
        });

        User.findAll().then(data => {
            if (data.length == 0) {
                User.bulkCreate(userData, {
                    fields: ["username", "pass", "full_name", "contact_no", "dob", "gender", "address", "role_id", "profile_pic", "active_status"]
                })
            }
        })
    })
    .catch(err => {
        console.error(`Unable to connect to the database in ${process.env.STAGE} mode:`, err);
    });
