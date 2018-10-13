/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
require('dotenv').config();
const CONNECTION_STRING = process.env.DB; // use MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {

  app.route('/api/stock-prices')
    .get(function(req, res) {

    });

};
