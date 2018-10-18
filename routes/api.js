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

mongoose.connect(CONNECTION_STRING);
const Schema = mongoose.Schema;
const stockSchema = new Schema({
  ticker: {type: String, required: true},
  likes: {type: Number, required: false, default: 0},
  likeIPs: {type: [String], required: false, default: []},
});
const Stock = mongoose.model('Stock', stockSchema);

const handleStock = function(stock, isLiked, clientIP, callback) {
  if (isLiked && stock.likeIPs.indexOf(clientIP) === -1) {
    stock.likes += 1;
    stock.likeIPs.push(clientIP);
  }
  stock.save(callback);
};

module.exports = function(app) {

  app.route('/api/stock-prices')
     .get(function(req, res) {
       let ticker = req.query.stock;
       let clientIP = (req.header('x-forwarded-for') || req.connection.remoteAddress).split(':').slice(-1)[0];
       let isLiked = req.query.like;
       Stock.find({ticker: ticker}, function(err, stocks) {
        if (err) {
          res.status(400)
             .send(err);
        } else if (stocks.length === 0) {
          let s = new Stock({ticker: ticker});
          handleStock(s, isLiked, clientIP, function(e, doc) {
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
          handleStock(stocks[0], isLiked, clientIP, function(e, doc) {
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
        }
      });
     });
};
