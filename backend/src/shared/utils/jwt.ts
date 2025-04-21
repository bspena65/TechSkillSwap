import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url: string;
  bio: string;
  auth_provider: string;
  roles: string;
  iat: string;
  exp: string;
}

export const verifyAndReturnJWT = (token = ''): [boolean, User | null] => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || '');

    return [true, user];
  } catch (error) {
    return [false, null];
  }
};
