const server = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

chai.use(chaiHttp);

describe("User API", () => {

    describe('POST /user/add-user', () => {
        it("It should ADD a new user", (done) => {
            chai.request(server)
                .post('/user/add-user')
                .send({
                    "username": "test",
                    "pass": "1234",
                    "full_name": "Test User",
                    "role_id": 1,
                    "contact_no": 170000000
                })
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'User Created Successfully');
                    done();
                });
        });
    });

    describe('POST /user/add-user', () => {
        it("It should give a REQUIRED error", (done) => {
            chai.request(server)
                .post('/user/add-user')
                .send({
                    "pass": "1234",
                    "full_name": "Test User",
                    "role_id": 1,
                    "contact_no": 170000000
                })
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', "Required field(s) : username ");
                    done();
                });
        });
    });

    describe('POST /user/add-user', () => {
        it("It should give a AlREADY EXISTS error", (done) => {
            chai.request(server)
                .post('/user/add-user')
                .send({
                    "username": "test",
                    "pass": "1234",
                    "full_name": "Test User",
                    "role_id": 1,
                    "contact_no": 170000000
                })
                .end((err, response) => {
                    response.should.have.status(409);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Username Already Exist!!');
                    done();
                });
        });
    });

})

describe("User API Logged In", () => {

    let token = '';

    before(function (done) {
        chai.request(server)
            .post('/user/add-user')
            .send({
                "username": "test2",
                "pass": "1234",
                "full_name": "Test User2",
                "role_id": 1,
                "contact_no": 170000000
            })
            .end((err, response) => {
                id = response.body.user.id;
                response.should.have.status(201);
                response.body.should.be.a('object');
                response.body.should.have.property('message', 'User Created Successfully');
                done();
            });
    });


    beforeEach(function (done) {
        chai.request(server)
            .post('/login')
            .send({ username: 'test', pass: '1234' })
            .end(function (err, res) {
                res.status.should.equal(200);
                token = res.body.token;
                res.type.should.equal('application/json');
                done();
            });
    });

    describe('PATCH /user/update-user', () => {
        it("It should UPDATE an user", (done) => {
            chai.request(server)
                .patch('/user/update-user')
                .send({
                    "username": "test2",
                    "full_name": "Test User Updated"
                })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(500);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Validation error');
                    done();
                });
        });
    });

    describe('GET /user/deactivate', () => {
        it("It should DEACTIVATE an user", (done) => {
            chai.request(server)
                .get('/user/deactivate')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'User Updated Successfully');
                    done();
                });
        });
    });

})
