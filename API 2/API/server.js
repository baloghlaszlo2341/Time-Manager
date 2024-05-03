require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

var db_modul = require('./modules/database');
var file_modul = require('./modules/fileupload');
var email_modul = require('./modules/email');

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

app.use('/db', db_modul);
app.use('/file', file_modul);
app.use('/email', email_modul);

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});