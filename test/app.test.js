const request = require('supertest');
const app = require('./app'); // Adjust the path to your app.js file

describe('Test the root path', () => {
  test('It should respond to the GET method', (done) => {
    request(app).get('/test').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
