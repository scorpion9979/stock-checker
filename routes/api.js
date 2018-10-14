/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');
require('dotenv').config();
const CONNECTION_STRING = process.env.DB;

module.exports = function(app) {
  mongoose.connect(CONNECTION_STRING, function(err, db) {
    app.route('/api/stock-prices')
    .get(function(req, res) {

    });
  });
};
