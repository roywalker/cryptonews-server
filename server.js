const express = require('express');
const app = express();
const helmet = require('helmet');

app.use(express.json(), helmet());

app.listen(3000, () => console.log('Listening in port 3000'));
