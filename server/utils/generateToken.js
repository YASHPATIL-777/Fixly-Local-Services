import jwt from 'jsonwebtoken';

const generateToken = (res, userId, role) => {
  const secret = process.env.JWT_SECRET || 'fixnear_default_jwt_secret_key_2026';
  
  const token = jwt.sign({ id: userId, role }, secret, {
    expiresIn: '30d'
  });

  // Set HTTP-Only Cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 Days
  });

  return token;
};

export default generateToken;
