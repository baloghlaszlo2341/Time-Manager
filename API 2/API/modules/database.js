// -------------------------
// Database CRUD operations
// -------------------------

const router = require('express').Router();
var mysql = require('mysql');
var { sendResults, getOperator, tokencheck } = require('./functions');
var jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DBHOST,
  user            : process.env.DBUSER,
  password        : process.env.DBPASS,
  database        : process.env.DBNAME,
  timezone: 'UTC'
});

// ENDPOINTS

router.get('/permissioncheck', tokencheck(), (req, res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(user)
    if (user.rights == 'adminisztrátor'){
        res.send(true);
    }else{
        res.send(false);
    }
}) 

// logincheck
router.post('/logincheck', (req, res)=>{

    let table = 'users';
    let field1 = 'email';
    let field2 = 'passwd';
    let value1 = req.body.email;
    let value2 = req.body.passwd;
  
    pool.query(`SELECT * FROM ${table} WHERE ${field1}='${value1}' AND ${field2}='${value2}'`, (err, results)=>{
       if (results.length > 0){
           let user = {
               ID: results[0].ID,
               name: results[0].name,
               email: results[0].email,
               rights: results[0].rights
            }   
            results[0] ={ token: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})};
        }
        else
        {
            results[0] = { token: '' }
        }
        sendResults(table, err, results[0], req, res, ' logincheck');
    });
});

// emailcheck
router.post('/emailcheck', (req, res)=>{

    let table = 'users';
    let field = 'email';
    let value = req.body.email;
   
    pool.query(`SELECT * FROM ${table} WHERE ${field}='${value}'`, (err, results)=>{
        if (results.length > 0){
            
            sendResults(table, err, results[0].secret, req, res, ' emailcheck');
        }
        else
        {
            results[0] = [];
            sendResults(table, err, results[0], req, res, ' emailcheck');

        }
    });
});

router.post('/restorepass', (req, res)=>{
    let data = req.body;
    pool.query(`SELECT secret FROM users WHERE email='${data.email}'`, (err, results) => {
        if (results.length > 0){
            if (results[0].secret != data.secret){
                // lejárt link
                results = [];
                sendResults(table, err, results, req, res, ' restorepass');

            }else{
                // jelszó módosítás
                let newSecret = uuid(); 
                pool.query(`UPDATE users SET passwd='${data.passwd}', secret='${newSecret}' WHERE email='${data.email}'`, (err, results)=>{
                    sendResults(table, err, results, req, res, ' restorepass');
                });
            }
        }else{
            // nincs ilyen email
            results = [];
            sendResults(table, err, results, req, res, ' restorepass');
        }
    
    });
});

// user registration
router.post('/registration', (req, res)=>{

    let data = req.body;

    pool.query(`SELECT * FROM users WHERE email='${data.email}'`, (err, results)=>{
       if (results.length > 0){
            sendResults('users', err, results[0], req, res, ' registration failed');
        }
        else
        {
            let rights = 'felhasználó';
            let secret = uuid();
            pool.query(`INSERT INTO users VALUES(null, '${data.name}', '${data.email}', '${data.passwd}', '${rights}', '${secret}')`, (err, results)=>{
                if (err){
                    sendResults('users', err, results, req, res, ' registration failed');
                }
                sendResults('users', err, results, req, res, ' registration success');
            });
        }
       
    });
});

router.get('/', function (req, res) {
    res.send('Simpe NodeJS Backend API');
});
  
// GET all records
router.get('/:table', tokencheck(), (req, res) => {
    let table = req.params.table;
    pool.query(`SELECT * FROM ${table}`, (err, results) => {
        sendResults(table, err, results, req, res, 'sent from');
    });
});
  
// GET one record by ID
router.get('/:table/:id', tokencheck(), (req, res) => {
    let table = req.params.table;
    let id = req.params.id;

    pool.query(`SELECT * FROM ${table} WHERE ID=${id}`, (err, results) => {
        sendResults(table, err, results, req, res, 'sent from');
    });
});
  
// GET records by field  
router.get('/:table/:field/:op/:value', tokencheck(), (req, res)=>{
    let table = req.params.table;
    let field = req.params.field;
    let value = req.params.value;
    let op = getOperator(req.params.op);

    if (op == ' like '){
        value = `%${value}%`;
    }

    pool.query(`SELECT * FROM ${table} WHERE ${field}${op}'${value}'`, (err, results)=>{
        sendResults(table, err, results, req, res, 'sent from');
    });
});
  
// POST new record to table
router.post('/:table', tokencheck(), (req, res)=>{
    let table = req.params.table;

    let values = '"'+ Object.values(req.body).join('","') +'"';
    let fields = Object.keys(req.body).join(',');

    pool.query(`INSERT INTO ${table} (${fields}) VALUES(${values})`, (err, results)=>{
        sendResults(table, err, results, req, res, 'insert into');
    });
});

// PATCH record in table by field (update)
router.patch('/:table/:field/:op/:value', tokencheck(), (req, res) => {
    let table = req.params.table;
    let field = req.params.field;
    let value = req.params.value;
    let op = getOperator(req.params.op);

    if (op == ' like '){
        value = `%${value}%`;
    }

    let values = Object.values(req.body);
    let fields = Object.keys(req.body);

    let sql = '';
    for(i=0; i< values.length; i++){
        sql += fields[i] + `='` + values[i] + `'`;
        if (i< values.length-1) {
        sql += ',';
        } 
    }

    pool.query(`UPDATE ${table} SET ${sql} WHERE ${field}${op}'${value}'`, (err, results)=>{
        sendResults(table, err, results, req, res, 'updated in');
    });

});

// DELETE one record by ID
router.delete('/:table/:id', tokencheck(), (req, res) => {
    let table = req.params.table;
    let id = req.params.id;

    pool.query(`DELETE FROM ${table} WHERE ID=${id}`, (err, results) => {
        sendResults(table, err, results, req, res, 'sent from');
    });
});

// DELETE record from table by field
router.delete('/:table/:field/:op/:value', tokencheck(), (req, res) => {
    let table = req.params.table;
    let field = req.params.field;
    let value = req.params.value;
    let op = getOperator(req.params.op);

    if (op == ' like '){
        value = `%${value}%`;
    }

    pool.query(`DELETE FROM ${table} WHERE ${field}${op}'${value}'`, (err, results) => {
        sendResults(table, err, results, req, res, 'deleted from');
    }); 
});

// DELETE all records from table
router.delete('/:table', tokencheck(), (req, res) => {
    let table = req.params.table;
    pool.query(`DELETE FROM ${table}`, (err, results) => {
        sendResults(table, err, results, req, res, 'deleted from');
    }); 
});

module.exports =  router;

