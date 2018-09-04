//do i have to make an additional schema to allow for multiple books

'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bookLibrarySchema = mongoose.Schema({
	title: {type: String, required: true},
	author: {type: String, required: true},
	readingLevel: {type: String, required: true},
	checkoutDate: {type: Date, default: null}, //potentially play around with as we go
	dueDate: {type: Date},
	genre: {type: String, required: true},
	description: {type: String, required: true},
  studentName: {type: String, required: true}
});

bookLibrarySchema.methods.serialize = function() {
  return {
    id: this._id,
    author: this.author,
    readingLevel: this.readingLevel,
    title: this.title,
    created: this.created,
    description: this.description,
    genre: this.genre,
    checkoutDate: this.checkoutDate,
    studentName: this.studentName,
     };
};

const LibraryBooks = mongoose.model('LibraryBooks', bookLibrarySchema);

module.exports = {LibraryBooks};

