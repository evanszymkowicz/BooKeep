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
    .find({title: decodeURIComponent(req.params.title)})
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

app.get('/getbooks/checkedout', (req, res) =>{
  LibraryBooks
    .find({checkoutDate: {$ne:null}})
    .then(checkedBooks => {
      res.json(checkedBooks.map(checkedBook => checkedBook.serialize()));
      })
      .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
      });
    });

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

app.put('/update/:id', (req, res) => {
  
  const updated = {};
  const updateableFields = ['author', 'readingLevel', 'title', 'description', 'genre', 'checkoutDate', 'studentName'];
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

app.put('/checkout/:id', (req, res) => {
  const updated = {};
  const updateableFields = ['checkoutDate', 'studentName'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
 
 LibraryBooks
    .findByIdAndUpdate(req.params.id, { checkoutDate: updated.checkoutDate, studentName: updated.studentName })
    .then(updatedBook => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

app.delete('/delete/:id', (req, res) => {
   LibraryBooks
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.id}\``);
      res.status(204).end();
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
