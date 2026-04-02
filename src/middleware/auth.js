import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId   = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const patientOnly = (req, res, next) => {
  if (req.userRole !== 'patient') return res.status(403).json({ success: false, error: 'Patient access only' });
  next();
};

export const clinicianOnly = (req, res, next) => {
  if (req.userRole !== 'clinician') return res.status(403).json({ success: false, error: 'Clinician access only' });
  next();
};
