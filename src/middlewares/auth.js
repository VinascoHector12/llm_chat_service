import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export function auth(req, res, next) {
  // Intentar obtener token de header Authorization o query parameter (para SSE)
  const authHeader = req.headers.authorization || '';
  let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  // Si no hay token en header, intentar desde query parameter
  if (!token && req.query.token) {
    token = req.query.token;
  }
  
  // Logging para debug
  console.log('[Auth] Path:', req.path);
  console.log('[Auth] Has Authorization header:', !!authHeader);
  console.log('[Auth] Has query token:', !!req.query.token);
  console.log('[Auth] Token found:', !!token);
  
  if (!token) {
    console.log('[Auth] No token found - returning 401');
    return res.status(401).json({ error: 'missing_token' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    console.log('[Auth] Token valid for user:', payload.userId, 'role:', payload.role, 'tenant:', payload.tenantId);
    req.user = payload;
    next();
  } catch (err) {
    console.log('[Auth] Token verification failed:', err.message);
    return res.status(401).json({ error: 'invalid_token' });
  }
}
