export const validateLog = (req, res, next) => {
  const errors = [];
  if (!req.body.date) errors.push('date is required');
  for (const f of ['mood', 'focus', 'sleep', 'energy', 'impulsivity']) {
    const v = req.body[f];
    if (v == null) { errors.push(`${f} is required`); continue; }
    const n = Number(v);
    if (isNaN(n) || n < 1 || n > 5) errors.push(`${f} must be between 1 and 5`);
  }
  if (errors.length) return res.status(400).json({ success: false, error: errors.join(', ') });
  next();
};
