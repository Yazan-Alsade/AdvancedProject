

const express = require('express');
const app = express();
const port = 3000;

const api = require('./components/BoardJops/api.jops');
const auth= require('./components/auth.js/user.api');

app.use(express.json());

app.use('/api', api);
app.use('/auth', auth);


const debugSQLQuery = (req, res, next) => {
  console.log('Generated SQL query:', req.sqlQuery);
  next();
};

app.use(debugSQLQuery);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
