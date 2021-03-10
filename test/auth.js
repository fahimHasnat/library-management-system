const server = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

chai.use(chaiHttp);

describe("LOGIN API", () => {

    describe('POST /login', () => {
        it("It should LOGIN a user", (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    "username": "test2",
                    "pass": "1234"
                })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('token');
                    response.body.should.have.property('id');
                    response.body.should.have.property('username');
                    response.body.should.have.property('role');
                    response.body.should.have.property('access');
                    response.body.access.should.be.a('object');
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it("It should throw a DEACTIVATED USER message", (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    "username": "test",
                    "pass": "1234"
                })
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Sorry. Your account is deactivated');
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it("It should throw a USER DOES NOT EXISTS message", (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    "username": "test_test",
                    "pass": "1234"
                })
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', "This Account Doesn't Exist");
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it("It should throw a USER ID or PASSWORD INCORRECT message", (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    "username": "test2",
                    "pass": "12345"
                })
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', "User ID or Password is incorrect.!");
                    done();
                });
        });
    });

})
