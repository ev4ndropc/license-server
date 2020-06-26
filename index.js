const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

const config = require("./config");
const routes = require('./routes/routes');

const connection = require('./database');

const Admin = require('./models/Admin');
const Customer = require('./models/Customers');

const app = express();
app.use(cors());



connection.authenticate()
  .then(() => {
        console.log('Successful connection!')
  }).catch((error) => {
      console.log(error)
  });

// View engine

app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: "cm9ja2V0cGFpbmVsLmNvbS5icg==",
    cookie: { maxAge: 30000000 },
    saveUninitialized: true,
    resave: true,
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Router
app.use(routes);

// End Router
app.listen(process.env.PORT, () => {
  console.log(`Server started at port: ${process.env.PORT}`);
});
