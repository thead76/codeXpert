// server.js
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 8888;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}...`);
  });
};

startServer();