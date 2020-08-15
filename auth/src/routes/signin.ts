import { BadRequestError, validateRequest } from '@umeshbhatorg/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { Password } from '../services/password'
const router = express.Router()
router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid/provided'),
    body('password').trim().notEmpty().withMessage('Password must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError('Invalid creds')
    }
    const passwordMatch = await Password.compare(existingUser.password, password)
    if (!passwordMatch) {
      throw new BadRequestError('Invalid creds')
    }
    const userJwt = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!)
    req.session = { jwt: userJwt }
    return res.status(200).send(existingUser)
  }
)

export { router as signinRouter }
