const app = require('./app.js');
const logger = require('./utils/logger')
const port = process.env.PORT || 3001;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
