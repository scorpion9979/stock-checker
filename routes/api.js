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
    likes: {type: Number, required: false, default: 0},
  });
  const Stock = mongoose.model('Stock', stockSchema);
  app.route('/api/stock-prices')
     .get(function(req, res) {
       let ticker = req.query.stock;
       Stock.find({ticker: ticker}, function(err, stocks) {
        if (err) {
          res.status(400)
             .send(err);
        } else if (stocks.length === 0) {
          let s = new Stock({ticker: ticker});
          s.save(function(e, doc) {
            if (e) {
              res.status(400)
                 .send(err);
            } else {
              res.send({
                stockData: {
                  stock: doc.ticker,
                  price: '0',
                  likes: doc.likes,
                },
               });
            }
          });
        } else {
          res.send({
            stockData: {
              stock: stocks[0].ticker,
              price: '0',
              likes: stocks[0].likes,
            },
           });
        }
      });
     });
};
