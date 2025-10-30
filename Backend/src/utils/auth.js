import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'root_123';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (userId) => {
  if (!JWT_SECRET || JWT_SECRET === 'root_123') {
    console.warn('Warning: Using default JWT secret. Change JWT_SECRET in production!');
  }
  
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const hashPassword = async (password) => {
  if (!password) {
    throw new Error('Password is required');
  }
  return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    return false;
  }
  return await bcrypt.compare(password, hashedPassword);
};