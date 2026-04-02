import 'dotenv/config';
import app from "./app.js";
import connectDB from './config/db.js';

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🧠 Fokus API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Startup failed:', err.message);
    process.exit(1);
  });

export default app;
