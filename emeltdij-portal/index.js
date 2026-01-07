require('dotenv').config();

const app = require('./src/app');
const PORT = process.env.PORT || 3000;

// Szerver indítás
app.listen(PORT, () => {
  console.log(`Express szerver fut a ${PORT} porton`);
});
