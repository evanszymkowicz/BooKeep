"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://jkathan:Milk68not!@ds123532.mlab.com:23532/bookkeep";
exports.TEST_DATABASE_URL = 
	process.env.TEST_DATABASE_URL || "mongodb://localhost/bookshelf-app";
exports.PORT = process.env.PORT || 8080;