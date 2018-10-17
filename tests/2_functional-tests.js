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
        .query({stock: 'goog'})
        .end(function(err, res) {
          assert.isObject(res.body.stockData, 'res.stockData is invalid');
          assert.isString(res.body.stockData.stock, 'res.stockData.stock is invalid');
          assert.isNumber(parseFloat(res.body.stockData.price), 'res.stockData.price is invalid');
          assert.isNumber(res.body.stockData.likes, 'res.stockData.likes is invalid');
          done();
        });
      });

      test('1 stock with like', function(done) {

      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {

      });

      test('2 stocks', function(done) {

      });

      test('2 stocks with like', function(done) {

      });

    });

});
