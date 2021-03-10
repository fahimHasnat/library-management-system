const server = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

chai.use(chaiHttp);

describe("Category API", () => {
    let token = '';
    let id;

    beforeEach(function (done) {
        chai.request(server)
            .post('/login')
            .send({ username: 'fah1m', pass: '1234' })
            .end(function (err, res) {
                res.status.should.equal(200);
                token = res.body.token;
                res.type.should.equal('application/json');
                done();
            });
    });

    describe('POST /category/add-category', () => {
        it("It should ADD a new category", (done) => {
            chai.request(server)
                .post('/category/add-category')
                .send({ "name": "test" })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    id = response.body.category.id;
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    response.body.should.have.property('category');
                    done();
                });
        });
    });

    describe('GET /category/categories', () => {
        it("It should GET all the Categories", (done) => {
            chai.request(server)
                .get('/category/categories')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('categories');
                    response.body.categories.should.be.a('array');
                    response.body.categories[0].should.have.property('id');
                    response.body.categories[0].should.have.property('name');
                    done();
                });
        });
    });


    describe('POST /category/add-category', () => {
        it("It should throw an ALREADY EXIST error", (done) => {
            chai.request(server)
                .post('/category/add-category')
                .send({ "name": "test" })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(409);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Category Already Exists!!');
                    done();
                });
        });
    });

    describe('POST /category/update-category', () => {
        it("It should UPDATE a category", (done) => {
            chai.request(server)
                .patch('/category/update-category')
                .send({ "name": "testt", "category_id": id })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Category Updated Successfully');
                    done();
                });
        });
    });

    describe('PATCH /category/update-category', () => {
        it("It should throw an ALREADY EXIST error", (done) => {
            chai.request(server)
                .patch('/category/update-category')
                .send({ "name": "testt", "category_id": id })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(409);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Category Already Exists!!');
                    done();
                });
        });
    });

    describe('DELETE /category/delete-category', () => {
        it("It should DELETE a category", (done) => {
            chai.request(server)
                .delete(`/category/delete-category/${id}`)
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Category Deleted Successfully');
                    done();
                });
        });
    });

});