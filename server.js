require("dotenv").config();
const jwt = require('jsonwebtoken');
const db = require("./models");
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();

require('./startup/ex')(app);
require('./startup/cors')(app);
require('./startup/routes')(app);
require("./routes/htmlRoutes")(app);
require('./startup/prod')(app);
require('./startup/middleware')(app);

const syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

const PORT = process.env.PORT || 3000;

db
  .sequelize
  .sync(syncOptions)
  .then(() => {
    app.listen(PORT, () => console.log("Listening on port", PORT));
  });

// for testing
console.log(jwt.sign({ id: 1 }, process.env.jwtPrivateKey));
console.log(jwt.sign({ id: 2 }, process.env.jwtPrivateKey));

module.exports = app;
