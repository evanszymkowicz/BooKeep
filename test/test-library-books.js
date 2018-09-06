'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const { LibraryBooks } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedLibraryBooksData() {
  console.info('seeding library data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      author: faker.name.lastName(),
      readingLevel: faker.random.number(), 
      title: faker.lorem.sentence(),
      checkoutDate: faker.date.past(),
      genre: faker.name.lastName().toUpperCase(), 
      description: faker.lorem.paragraph()
    });
  }

  return LibraryBooks.insertMany(seedData);
}

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}



describe('library books API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedLibraryBooksData(); //within ()take in 
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });


  describe('GET endpoint', function () {

    it('should return all existing posts', function () {
      let res;
      return chai.request(app)
        .get('/getbooks')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.lengthOf.at.least(1);

          return LibraryBooks.count();
        })
        .then(count => {
         
          res.body.should.have.lengthOf(count);
        });
	});

	it('should return books with right fields', function () {
      let resBook;
      return chai.request(app)
        .get('/getbooks')
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.lengthOf.at.least(1);
          res.body.forEach(function (post) {
            post.should.be.a('object');
            post.should.include.keys('id', 'author', 'readingLevel', 'title', 'description', 'genre');
          });
          // just check one of the posts that its values match with those in db
          // and we'll assume it's true for rest
          resBook = res.body[0];
          return LibraryBooks.findById(resBook.id);
        })
        .then(book => {
          resBook.title.should.equal(book.title);
          resBook.readingLevel.should.equal(book.readingLevel);
          resBook.author.should.equal(book.author);
          resBook.description.should.equal(book.description);
          resBook.genre.should.equal(book.genre);
        });
    });
});

  describe('POST endpoint', function () {
    
    it('should add a new library book', function () {

      const newBook = {
      author:  faker.name.lastName(),
      readingLevel: faker.random.number(), //make not random
      title: faker.lorem.sentence(),
      genre: faker.name.lastName().toUpperCase(), //make not random
      description: faker.lorem.paragraph()
    };
  

      return chai.request(app)
        .post('/add')
        .send(newBook)
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'author', 'readingLevel', 'title', 'description', 'genre');
          res.body.title.should.equal(newBook.title);
          res.body.id.should.not.be.null;
          res.body.author.should.equal(newBook.author);
          res.body.readingLevel.should.equal(newBook.readingLevel.toString());
          res.body.description.should.equal(newBook.description);
          res.body.genre.should.equal(newBook.genre.toUpperCase());
          return LibraryBooks.findById(res.body.id);
        })
        .then(function (book) {
          book.title.should.equal(newBook.title);
          book.readingLevel.should.equal(newBook.readingLevel.toString());
          book.author.should.equal(newBook.author); 
          book.description.should.equal(newBook.description);
          book.genre.should.equal(newBook.genre.toUpperCase());
        });
    });
});

describe('PUT endpoint', function () {

    // strategy:
    //  1. Get an existing post from db
    //  2. Make a PUT request to update that post
    //  4. Prove post in db is correctly updated
    it('should update fields you send over', function () {
      const updateData = {
        author:'P.D. Eastman',
      	readingLevel: 'Pre-k',
      	title: 'Go, Dog, Go',
      	genre: 'Adventure',
      	description: "test"
      };

      return LibraryBooks
        .findOne()
        .then(post => {
          updateData.id = post.id;

          return chai.request(app)
            .put(`/update/${post.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return LibraryBooks.findById(updateData.id);
        })
        .then(book => {
          book.title.should.equal(updateData.title);
          book.readingLevel.should.equal(updateData.readingLevel);
          book.author.should.equal(updateData.author); //might run into isses
          book.description.should.equal(updateData.description);
          book.genre.should.equal(updateData.genre)
        });
    });

    it('should update fields you send over', function () {
      const updateData = {
        checkoutDate: faker.date.past(),
        studentName: 'sally joe',
      };

      return LibraryBooks
        .findOne()
        .then(post => {
          updateData.id = post.id;

          return chai.request(app)
            .put(`/checkout/${post.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return LibraryBooks.findById(updateData.id);
        })
        .then(book => {
          book.checkoutDate.should.eql(updateData.checkoutDate);
          book.studentName.should.equal(updateData.studentName);
        });
    });

describe('DELETE endpoint', function () {
    it('should delete a post by id', function () {

      let book;

      return LibraryBooks
        .findOne()
        .then(_book => {
          book = _book;
          return chai.request(app).delete(`/delete/${book.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return LibraryBooks.findById(book.id);
        })
        .then(_book => {
          should.not.exist(_book);
        });
      });
    });
  });
});