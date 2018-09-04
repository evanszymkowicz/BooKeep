//for checkout do i need to create a new schema for them to be added to it?
//essentially im pulling from a database and entering it into my api
//with jwt do i need to update my "/" paths
//i guess i dont understand what to do now. like do i write the js ans call this as if it were an api?
//do i want to call based on all checked in books
//how do i allow for a range within api returns? For instance a book has a range of reading levels
//what is system for adding and deleting and updating? like how do i have it ensure that?


//things id like to get done during mentor session:
//learn how to make an api call to this
//get my code up and running/make an api call
//make a list of all the things i need to test
//discuss how best to set up the html

'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const uuid = require("uuid");
mongoose.Promise = global.Promise;

//for users and auth
/*const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');*/

const { DATABASE_URL, PORT } = require('./config');
const { LibraryBooks } = require('./models');
const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('combined'));
app.use(express.json());

app.use("/", express.static(__dirname + '/public'))

app.get('/getbooks', (req, res) =>{
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

app.get('/getbooks/byTitle/:title', (req, res) => {
  LibraryBooks
    .find({title: req.params.title})
    .then(booktitles => {
      res.json(booktitles.map(booktitle => booktitle.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.get('/getbooks/bygenre/:genre', (req, res) => {
  LibraryBooks
    .find({genre: req.params.genre})
    .then(bookgenres => {
      res.json(bookgenres.map(bookgenre => bookgenre.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.get('/getbooks/byID/:id', (req, res) => {
  LibraryBooks
    .find({_id: req.params.id})
    .then(bookIDs => {
      res.json(bookIDs.map(bookID => bookID.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


/*
//still need help with this one
app.get('/getbooks/byreadinglevel/bygenre', (req, res) => {
  LibraryBooks
    .find({readingLevel: req.params.readingLevel, genre: req.params.genre}) //this might need $and
    .then(bookreadinglevels => {
      res.json(bookreadinglevels.map(bookreadinglevel => bookreadinglevel.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

//bring back bygenre, byreadinglevel, bygenre/byreadinglevel
//look into mongo find and see how to specify both are criteria
//confused
/*app.get('/books/byid', (req, res) => {
	//bytype = id
	LibraryBooks
	    .findById(req.params.id)
	    .then(book => res.json(book.serialize()))
	    .catch(err => {
	      console.error(err);
	      res.status(500).json({ error: 'something went horribly awry' });
	    });
});*/

app.post('/add', jsonParser, (req, res) => {
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
      //id: uuid.v4(),
	    title: req.body.title,
      author: req.body.author,
	    genre: req.body.genre,
	    readingLevel: req.body.readingLevel,
	    description: req.body.description
	    
    })
    .then(libraryBook => res.status(200).json(libraryBook.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


//go over this more extensively
//does this need become "byId"?

//find book by id
//update any or all information about book

app.put('/update/:id', (req, res) => {
  
  const updated = {};
  const updateableFields = ['author', 'readingLevel', 'title', 'description', 'genre', 'checkoutDate'];
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

//find book by id
//update date of book checked when clicked

app.put('/checkout/:id', (req, res) => {
  const updated = {};
  const updateableFields = ['checkoutDate', 'dueDate'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
 
 LibraryBooks
    .findByIdAndUpdate(req.params.id, { checkoutDate: updated.checkoutDate, dueDate: updated.dueDate })
    .then(updatedBook => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

//this works in theory
app.delete('/delete/:id', (req, res) => {
   LibraryBooks
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.id}\``);
      res.status(204).end();
    });
});

//jwt auth and passwrod
/*app.use(function (req, res, next) {
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
*/
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