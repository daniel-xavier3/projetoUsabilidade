const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const app = express();

const urlencodeParser = bodyParser.urlencoded({extended : false});



let port = process.env.PORT || 3000;

const crud = require('crud');
let cruds = new crud();

app.use('/img', express.static('img'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

app.engine('handlebars', handlebars.engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.get("/", function (req, res) {
        res.send('oi', {
            style: 'style.css'
        });
    });

app.get("/inserir", (req, res) => {
        res.render("inserir", {
            style: 'form.css'
        });
    });

app.get("/select/:id?", (req, res) => {
        cruds.read(req, res);
    });

app.post("/controllerForm", urlencodeParser, (req, res) => {
        cruds.create(req, res);
    });

app.get('/deletar/:id', (req, res) => {
        cruds.deletes(req, res);
    });

app.get("/update/:id",(req, res) => {
        cruds.update(req, res);
    });


app.post("/controllerUpdate",urlencodeParser,(req, res) => {
        cruds.update(req, res, 'controller');
});

app.listen(port, (req, res) => {
        console.log('Servidor on');
    });