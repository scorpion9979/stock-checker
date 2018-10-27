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
var async = require('async');
var fetch = require('node-fetch');
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

module.exports = function(app) {

  app.route('/api/stock-prices')
     .get(function(req, res) {
       let tickers = [req.query.stock].reduce((a, b) => a.concat(b), []);
       let clientIP = (req.header('x-real-ip') || req.connection.remoteAddress).split(':').slice(-1)[0];
       let isLiked = req.query.like;
       // map tickers array to array of updated stocks (from db)
       // async mini-tutorial:
       // https://stackoverflow.com/questions/18672601/mongoose-executing-a-query-for-each-array-element
       fetch('https://api.iextrading.com/1.0/stock/market/batch?types=price&symbols=' + tickers.join(','))
       .then(data => data.json())
       .then(prices => {
        async.map(tickers, function(t, next) {
          Stock.findOne({ticker: t}, function(err, stock) {
            if (!stock) {
              stock = new Stock({ticker: t});
            }
            if (isLiked && stock.likeIPs.indexOf(clientIP) === -1) {
              stock.likes += 1;
              stock.likeIPs.push(clientIP);
            }
            stock.save();
            next(err, stock);
          });
         }, function(err, stocks) {
          if (Object.keys(prices).length !== stocks.length) {
            res.status(400)
               .send('invalid request');
          } else if (stocks.length === 1) {
            res.send({
              stockData: {
                stock: stocks[0].ticker,
                price: prices[stocks[0].ticker.toUpperCase()].price,
                likes: stocks[0].likes,
              },
            });
          } else {
            let likes = stocks.map(e => e.likes);
            res.send({
              stockData: stocks.map((e, i) => {
                let distMin = e.likes - Math.min(...likes);
                let distMax =  Math.max(...likes) - e.likes;
                return ({
                stock: e.ticker,
                price: prices[e.ticker.toUpperCase()].price,
                rel_likes: distMax > distMin ? -distMax : distMin});
              }),
            });
          }
         });
       });
     })
     .delete(function(req, res) {
       let testTickers = [{ticker: 'aes'}, {ticker: 'amg'}];
       Stock.remove({$or: testTickers}, function(err) {
         if (err) {
           res.statue(400)
              .send('error deleting test stocks');
         } else {
           res.send('test stocks deleted successfully');
         }
       });
     });
};
