/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('GET /api/stock-prices => stockData object', function() {

      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'test_stock'})
        .end(function(err, res) {
          assert.isObject(res.body.stockData, 'res.stockData is invalid');
          assert.isString(res.body.stockData.stock, 'res.stockData.stock is invalid');
          assert.isNumber(parseFloat(res.body.stockData.price), 'res.stockData.price is invalid');
          assert.isNumber(res.body.stockData.likes, 'res.stockData.likes is invalid');
          done();
        });
      });

      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'test_stock', like: true})
        .end(function(err, res) {
          assert.equal(res.body.stockData.likes, 1, 'likes weren\'t updated');
          done();
        });
      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'test_stock', like: true})
        .end(function(err, res) {
          assert.equal(res.body.stockData.likes, 1, 'likes weren\'t updated');
          done();
        });
      });

      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['test_stock', 'test_stock1']})
        .end(function(err, res) {
          assert.isArray(res.body.stockData, 'res.stockData is invalid');
          res.body.stockData.forEach(stockData => {
            assert.isString(stockData.stock, 'res.stockData.stock is invalid');
            assert.isNumber(parseFloat(stockData.price), 'res.stockData.price is invalid');
            assert.isNumber(stockData.rel_likes, 'res.stockData.likes is invalid');
          });
          done();
        });
      });

      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['test_stock', 'test_stock1'], like: true})
        .end(function(err, res) {
          res.body.stockData.forEach(stockData => {
            assert.equal(stockData.rel_likes, 0, 'likes weren\'t updated');
          });
          done();
        });
      });

      test('remove all test stocks', function(done) {
        chai.request(server)
        .del('/api/stock-prices')
        .end(function(err, res) {
          assert.equal(res.status, 200, 'error removing test stocks');
          done();
        });
      });

    });

});
