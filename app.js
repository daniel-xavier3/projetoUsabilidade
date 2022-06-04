const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');

const app = express();

const urlencodeParser = bodyParser.urlencoded({extended : false});

const sql = mysql.createPool({
    host:'us-cdbr-east-05.cleardb.net',
    user:'bcd6566bc729bc',
    password:'0a988156',
    database: 'heroku_8dbd8eb0440736d'
});

let port = process.env.PORT || 3000;

app.use('/img', express.static('img'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

app.engine('handlebars', handlebars.engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.get("/", function (req, res) {
        res.render('index', {
            style: 'style.css'
        });
    });

app.get("/inserir", (req, res) => {
        res.render("inserir", {
            style: 'form.css'
        });
    });

app.get("/select/:id?", (req, res) => {
        if (!req.params.id) {
            sql.getConnection((err, connection) => {
                connection.query("select * from user order by id asc", (err, results, fields) => {
                    res.render('select', {
                        data: results,
                        style: 'table.css'
                    });
                });
            });
        }
        else {
            sql.getConnection((err, connection) => {
                connection.query("select * from user where id=? order by id asc", [req.params.id], (err, results, fields) => {
                    res.render('select', {
                        data: results,
                        style: 'table.css'
                    });
                });
            });
        }
    });

app.post("/controllerForm", urlencodeParser, (req, res) => {
        sql.query("insert into user values(?, ?, ?)", [
            req.body.id,
            req.body.name,
            req.body.age
        ]);
        res.render("controllerForm", {
            name: req.body.name,
            style: 'success.css'
        });
    });

app.get('/deletar/:id', (req, res) => {
        sql.query("delete from user where id=?", [req.params.id]);
        res.render('deletar', {
            style: 'success.css'
        });
    });

app.get("/update/:id",(req, res) => {
        sql.query("select * from user where id=?", [req.params.id], 
        (err, results, fields) => {
                res.render('update', { 
                id: req.params.id, 
                name: results[0].name, 
                age: results[0].age,
                style: 'form.css' });
            });
    });
app.post("/controllerUpdate",urlencodeParser,(req, res) => {
        sql.query("update user set name=?,age=? where id=?", 
        [req.body.name, 
        req.body.age, 
        req.body.id]);
        res.render('controllerUpdate', {
            style: 'success.css'
        });
    });



app.listen(port, (req, res) => {
        console.log('Servidor on');
    });