const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Token error. Format should be: Bearer <token>' });
    }

    const token = parts[1];
    const privateKey = process.env.JWT_PRIVATE_TOKEN || 'f654cc3298ca27b36784aa1cb41dc7d1';

    const decoded = jwt.verify(token, privateKey);
    req.user = decoded; // Stocker l'utilisateur décodé (contient userId et role) dans la requête
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
