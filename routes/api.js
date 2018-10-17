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
  mongoose.connect(CONNECTION_STRING);
  const Schema = mongoose.Schema;
  const stockSchema = new Schema({
    ticker: {type: String, required: true},
    likes: {type: Number, required: false, default: 0}
  });
  const Stock = mongoose.model('Stock', stockSchema);
  app.route('/api/stock-prices')
     .get(function(req, res) {
       
     });
};
