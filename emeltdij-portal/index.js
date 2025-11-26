const express = require('express');

const statusRoutes = require('./src/v1/routes/statusRoutes');
const companyRoutes = require('./src/v1/routes/companyRoutes');
const clientRoutes = require('./src/v1/routes/clientRoutes');
const numberRoutes = require('./src/v1/routes/numberRoutes');
const trafficRoutes = require('./src/v1/routes/trafficRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Fő URL – változatlan szöveges válasz
app.get('/', (req, res) => {
  res.type('text/plain; charset=utf-8');
  res.send('EDT digit – Emeltdíjas Portál backend működik 🚀');
});

// V1 route-ok
app.use(statusRoutes);
app.use(companyRoutes);
app.use(clientRoutes);
app.use(numberRoutes);
app.use(trafficRoutes);

// 404 – minden más
app.use((req, res) => {
  res.status(404).type('text/plain; charset=utf-8');
  res.send('404 – Nincs ilyen végpont');
});

// Szerver indítás
app.listen(PORT, () => {
  console.log(`Express szerver fut a ${PORT} porton`);
});
