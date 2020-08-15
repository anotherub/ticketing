import request from 'supertest'
import { app } from '../../app'
it('return a 201 on successful signup', async () => {
  return request(app).post('/api/users/signup').send({ email: 'x@x.com', password: 'password' }).expect(201)
})
it('return a 400 on invalid input', async () => {
  return request(app).post('/api/users/signup').send({ email: 'xx.com', password: 'password' }).expect(400)
})
