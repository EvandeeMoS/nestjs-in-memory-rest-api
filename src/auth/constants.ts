import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: process.env.secret,
  expiresIn: '2h'
};
