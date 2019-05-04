const express = require('express');
const config = require('./config');
const cors = require('cors');
const helmet = require('helmet');
require('express-async-errors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

require('./routes')(app);

if (require.main === module)
  app.listen(config.port, () => console.log(`Listening...`));

module.exports = app;
