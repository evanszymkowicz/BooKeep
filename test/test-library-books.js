'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const { LibraryBooks } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedLibraryBooksData() {
  console.info('seeding library data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      authorName: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      readingLevel: faker.helpers.randomNumber(), //{kindergarten, 1, 2, 3, 4, 5}//make not random
      title: faker.lorem.sentence(),
      checkoutDate: faker.date.past(),
      dueDate: faker.date.future(),
      genre: faker.random.catch_phrase_noun(), //{horror, romance, humor}//input two genres
      description: faker.lorem.paragraph()
    });
  }

  return LibraryBooks.insertMany(seedData);
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
        .get('/books')
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
        .get('/books')
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
          resBook.author.should.equal(book.authorName);
          resBook.description.should.equal(book.description);
          resBook.genre.should.equal(book.genre)
        });
    });
});

  describe('POST endpoint', function () {
    
    it('should add a new library book', function () {

      const newBook = 
      authorName: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      readingLevel: faker.helpers.randomNumber(), //make not random
      title: faker.lorem.sentence(),
      deweyDecimalNumber: faker.helpers.randomNumber(), //make not random
      checkoutDate: faker.date.past(),
      dueDate: faker.date.future(),
      genre: faker.random.catch_phrase_noun(), //make not random
      description: faker.lorem.paragraph()
    };
  

      return chai.request(app)
        .post('/add')
        .send(newBook)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'author', 'readingLevel', 'title', 'description', 'genre');
          res.body.title.should.equal(newBook.title);
          // cause Mongo should have created id on insertion
          res.body.id.should.not.be.null;
          res.body.author.should.equal(
            `${newBook.author.firstName} ${newBook.author.lastName}`);
          res.body.readingLevel.should.equal(newBook.readingLevel);
          res.body.description.should.equal(newBook.description);
          res.body.genre.should.equal(newBook.genre)
          return BlogPost.findById(res.body.id);
        })
        .then(function (post) {
          book.title.should.equal(newBook.title);
          book.readingLevel.should.equal(newBook.readingLevel);
          book.author.firstName.should.equal(newBook.author.firstName);
          book.author.lastName.should.equal(newBook.author.lastName); //might run into isses
          book.description.should.equal(newBook.description);
          book.genre.should.equal(newBook.genre)
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
        authorName: {
	        firstName: 'P.D.',
	        lastName: 'Eastman',
      		},
      	readingLevel: {'Pre-k', 'kindergarten', '1', '2'},
      	title: 'Go, Dog, Go',
      	checkoutDate: faker.date.past(), //make sure correct
      	dueDate: faker.date.future(), //make sure correct
      	genre: 'Adventure'
      	description: "Whether by foot, boat, car, or unicycle, P. D. Eastman's lovable dogs demonstrate the many ways one can travel in this condensed, board-book version perfect for babies and toddlers."
        }
      };

      return BlogPost
        .findOne()
        .then(post => {
          updateData.id = post.id;

          return chai.request(app)
            .put(`/books/${post.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return LibraryBooks.findById(updateData.id);
        })
        .then(post => {
          book.title.should.equal(updateData.title);
          book.readingLevel.should.equal(updateData.readingLevel);
          book.author.firstName.should.equal(updateData.author.firstName);
          book.author.lastName.should.equal(updateData.author.lastName); //might run into isses
          book.description.should.equal(updateData.description);
          book.genre.should.equal(updateData.genre)
        });
    });

describe('DELETE endpoint', function () {
    // strategy:
    //  1. get a post
    //  2. make a DELETE request for that post's id
    //  3. assert that response has right status code
    //  4. prove that post with the id doesn't exist in db anymore
    it('should delete a post by id', function () {

      let book;

      return LibraryBooks
        .findOne()
        .then(_book => {
          book = _book;
          return chai.request(app).delete(`/books/${book.id}`);
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