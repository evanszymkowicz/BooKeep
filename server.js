//for checkout do i need to create a new schema for them to be added to it?
//essentially im pulling from a database and entering it into my api
//with jwt do i need to update my "/" paths
//i guess i dont understand what to do now. like do i write the js ans call this as if it were an api?
//do i want to call based on all checked in books


'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
mongoose.Promise = global.Promise;

//for users and auth
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

const { DATABASE_URL, PORT } = require('./config');
const { LibraryBooks } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.get('/books', (req, res) =>{
	LibraryBooks
		.find()
		.then(books => {
			res.json(books.map(book => book.serialize()));
			})
			.catch(err => {
      			console.error(err);
      			res.status(500).json({ error: 'something went terribly wrong' });
			});
		});

app.get('/books/bygenre', (req, res) => {
  LibraryBooks
    .find(req.params.genre)
    .then(bookgenres => {
      res.json(bookgenres.map(bookgenre => bookgenre.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});
//bring back bygenre, byreadinglevel, bygenre/byreadinglevel
//look into mongo find and see how to specify both are criteria
//confused
app.get('/books/byid', (req, res) => {
	//bytype = id
	LibraryBooks
	    .findById(req.params.id)
	    .then(book => res.json(book.serialize()))
	    .catch(err => {
	      console.error(err);
	      res.status(500).json({ error: 'something went horribly awry' });
	    });
});


//do i need to use jsonparser?
app.post('/add', (req, res) => {
  const requiredFields = ['author', 'readingLevel', 'title', 'description', 'genre'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  LibraryBooks
    .create({
	    author: req.body.authorName,
	    readingLevel: re.body.readingLevel,
	    title: req.body.title,
	    description: req.body.description,
	    genre: req.body.genre,
	    deweyDecimalNumber: req.body.deweyDecimalNumber
    })
    .then(libraryBook => res.status(201).json(libraryBook.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


//go over this more extensively
app.put('/library/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  const updated = {};
  const updateableFields = ['author', 'readingLevel', 'title', 'description', 'genre', 'deweyDecimalNumber', 'checkoutDate', 'dueDate'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  LibraryBooks
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedBook => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

app.put('/library/:id/:checkout', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
 //do i need to create a checked in field
 //like do i need this for them to be alble to edit
 //and then need an additional for editing checked in
  const updated = {};
  const updateableFields = ['checkoutDate', 'dueDate'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  LibraryBooks
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedBook => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

app.put('/books/:id/:renew', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
 //do i need to create a checked in field
 //like do i need this for them to be alble to edit
 //and then need an additional for editing checked in
  const updated = {};
  const updateableFields = ['checkoutDate', 'dueDate'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  LibraryBooks
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedBook => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

app.delete('/books/:id', (req, res) => {
  LibraryBooks
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.id}\``);
      res.status(204).end();
    });
});

//jwt auth and passwrod
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});


let server;



function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };