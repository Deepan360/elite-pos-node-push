const sql = require("mssql");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const bodyParsher = require("body-parser");
const bodyParser = require('body-parser');
const exhbs = require("express-handlebars");
const cors = require('cors');
const methodOverride = require('method-override');
const bcryptjs = require("bcrypt");

const app = express();

app.use(cors());

dotenv.config({
    path: './.env',
});

require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10), // Parse the port as an integer
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        enableArithAbort: true, 
    },
};

app.use(bodyParser.urlencoded({ extended: true }));

module.exports = config;

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect
    .then(() => {
        console.log('Connected to SQL Server 🚁');    
    })
    .catch((err) => {
        console.error('Error connecting to SQL Server:', err);
    });

app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(methodOverride('_method'));

app.use(bodyParsher.urlencoded({ extended: false }));
app.use(bodyParsher.json());

console.log(__dirname);
const location = path.join(__dirname, "./public",);
app.use(express.static(location));

app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const partialspath = path.join(__dirname, "./views/partials");
hbs.registerPartials(partialspath);

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(5000, () => {
    console.log("Server started @ port 5000 🚀 ");
});
