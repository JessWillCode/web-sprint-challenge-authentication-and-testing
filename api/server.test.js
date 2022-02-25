const User = require('../users/users-model');
const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () => {
  await db('users').truncate();
})

describe('user model', () => {
  it('shows empty table', async () => {
    const users = await db('users');
    expect(users).toHaveLength(0);
  })
})

describe('server endpoints', () => {
  it('[POST] /register ', async () => {
    let res = await request(server)
    .post('/api/auth/register')
    .send({ username: "Loki", password: "foobar"});

    expect(res.status).toBe(201)
  })

  it('[POST] /register should show credentials on successful registration ', async () => {
  let res = await request(server)
  .post('/api/auth/register')
  .send({ username: "Loki", password: "foobar"});

  expect(res.body).toHaveProperty('username', "Loki");
})

it('[POST] /login should return error message on failed login', async () => {
  let res =await request(server)
  .post('/api/auth/login')
  .send({username: 'Loki', password: 'foobar' });

  expect(res.body).toMatchObject({ message: 'Invalid credentials'});
})

it('[POST] /login should return error message if no username or password is entered', async () => {
  let res =await request(server)
  .post('/api/auth/login')
  .send({username: 'Loki'});

  expect(res.body).toMatchObject({ message: 'username and password required'});
})

it('[GET] / should show jokes on successful login', async () => {
  let res = await request(server).get('/api/jokes');

})

it('[GET] / does not show jokes ', async () => {
  let res = await request(server).get('/api/jokes');

})

})