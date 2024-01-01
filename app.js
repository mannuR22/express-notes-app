const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const logger = require('./utils/logger')
const db = require('./utils/mongoose')

db();
require('dotenv').config()

app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');

// Middleware
const middleware = require('./middleware/user');

// Mount routes
app.use('/api/auth-service', authRoutes);
app.use('/api/notes-service', middleware, notesRoutes);

// Hello World Route
app.get('/', (req, res) => {
  logger.info('Hello World route accessed.');
  res.send('Hello, World!');
});


module.exports = app;

