const server = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

chai.use(chaiHttp);

describe("Author API", () => {
    let token = '';
    let id = '';

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

    describe('POST /author/add-author', () => {
        it("It should ADD a new author", (done) => {
            chai.request(server)
                .post('/author/add-author')
                .send({
                    "name": "Arthur Morgan",
                })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    console.log(response.body);
                    id = response.body.author.id;
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('author');
                    response.body.should.have.property('message', 'Author Added Successfully');
                    response.body.author.should.have.property('id');
                    response.body.author.should.have.property('name');
                    done();
                });
        });
    });

    describe('POST /author/add-author', () => {
        it("It should give a REQUIRED error", (done) => {
            chai.request(server)
                .post('/author/add-author')
                .send({})
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', "Required field(s) : name ");
                    done();
                });
        });
    });

    describe('GET /author/authors', () => {
        it("It should GET all the authors", (done) => {
            chai.request(server)
                .get('/author/authors')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('authors');
                    response.body.authors.should.be.a('array');
                    response.body.authors[0].should.have.property('id');
                    response.body.authors[0].should.have.property('name');
                    done();
                });
        });
    });

    describe('PATCH /author/update-author', () => {
        it("It should UPDATE a author", (done) => {
            chai.request(server)
                .patch('/author/update-author')
                .send({
                    "author_id": id,
                    "name": "Arthur Morgan Jr"
                })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Author Updated Successfully');
                    done();
                });
        });
    });

    describe('DELETE /author/delete-author', () => {
        it("It should DELETE a author", (done) => {
            chai.request(server)
                .delete(`/author/delete-author/${id}`)
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Author Deleted Successfully');
                    done();
                });
        });
    });
})
