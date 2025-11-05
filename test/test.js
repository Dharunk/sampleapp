// test/test.js
const request = require('supertest');
const app = require('../src/index');

describe('GET /', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        if (!('status' in res.body)) throw new Error('missing status');
      })
      .end(done);
  });
});
