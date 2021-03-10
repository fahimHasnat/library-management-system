const server = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

chai.use(chaiHttp);

describe("Book API", () => {
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

    describe('POST /book/add-book', () => {
        it("It should ADD a new book", (done) => {
            chai.request(server)
                .post('/book/add-book')
                .send({
                    "title": "test",
                    "publication_year": 2000,
                    "category": [1],
                    "total": 5,
                    "author": [1]
                })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    id = response.body.book.id;
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.book.should.have.property('id');
                    response.body.book.should.have.property('title');
                    response.body.book.should.have.property('publication_year');
                    response.body.book.should.have.property('category');
                    response.body.book.category.should.be.a('array');
                    response.body.book.should.have.property('total');
                    response.body.book.should.have.property('author');
                    response.body.book.author.should.be.a('array');
                    done();
                });
        });
    });

    describe('POST /book/add-book', () => {
        it("It should give a REQUIRED error", (done) => {
            chai.request(server)
                .post('/book/add-book')
                .send({
                    "title": "test",
                    "category": [1],
                    "total": 5,
                    "author": [1]
                })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', "Required field(s) : publication_year ");
                    done();
                });
        });
    });

    describe('GET /book/books', () => {
        it("It should GET all the Books", (done) => {
            chai.request(server)
                .get('/book/books')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('books');
                    response.body.books.should.be.a('array');
                    response.body.books[0].should.have.property('id');
                    response.body.books[0].should.have.property('title');
                    response.body.books[0].should.have.property('publication_year');
                    response.body.books[0].should.have.property('category');
                    response.body.books[0].category.should.be.a('array');
                    response.body.books[0].should.have.property('total');
                    response.body.books[0].should.have.property('current');
                    response.body.books[0].should.have.property('authors');
                    response.body.books[0].authors.should.be.a('array');
                    done();
                });
        });
    });

    describe('POST /book/add-book', () => {
        it("It should throw an ALREADY EXIST error", (done) => {
            chai.request(server)
                .post('/book/add-book')
                .send({
                    "title": "test",
                    "publication_year": 2000,
                    "category": [1],
                    "total": 5,
                    "author": [1]
                })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(409);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Book already exists!!');
                    done();
                });
        });
    });

    describe('PATCH /book/update-book', () => {
        it("It should UPDATE a book", (done) => {
            chai.request(server)
                .patch('/book/update-book')
                .send({
                    "book_id": id,
                    "title": "testt",
                    "publication_year": 2000,
                    "category": [1],
                    "total": 5,
                    "author": [1]
                })
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Book Updated Successfully');
                    done();
                });
        });
    });

    describe('GET /book/get-book', () => {
        it("It should VIEW a book", (done) => {
            chai.request(server)
                .get(`/book/get-book/${id}`)
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.book.should.have.property('id');
                    response.body.book.should.have.property('title');
                    response.body.book.should.have.property('publication_year');
                    response.body.book.should.have.property('category');
                    response.body.book.category.should.be.a('array');
                    response.body.book.should.have.property('total');
                    response.body.book.should.have.property('current');
                    response.body.book.should.have.property('authors');
                    response.body.book.authors.should.be.a('array');
                    done();
                });
        });
    });

    describe('GET /book/search', () => {
        it("It should VIEW a book", (done) => {
            chai.request(server)
                .get('/book/search/tes')
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('result');
                    response.body.result.should.be.a('array');
                    response.body.result[0].should.be.a('object');
                    response.body.result[0].should.have.property('item');
                    response.body.result[0].item.should.have.property('title', 'testt');
                    done();
                });
        });
    });


    describe('DELETE /book/delete-book', () => {
        it("It should DELETE a book", (done) => {
            chai.request(server)
                .delete(`/book/delete-book/${id}`)
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message', 'Book Deleted Successfully');
                    done();
                });
        });
    });
})
