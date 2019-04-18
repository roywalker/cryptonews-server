require('dotenv').config();
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening in port ${PORT}`));
