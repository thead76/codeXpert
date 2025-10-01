// server.js

// Make sure these two lines are the absolute first lines in this file.



// Now, import other modules
import app from './src/app.js';

const PORT = process.env.PORT || 8888; // Using 8888 as an example

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}...`);
});