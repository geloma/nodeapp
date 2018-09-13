var express    = require('express');
var path       = require("path");
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var app        = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
//conexion a la base de datos
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "test"});
//Se realiza la conexion una sola vez
connection.connect(function(){});

app.get('/product/get', function (req, res) {
  connection.query("SELECT * FROM product", function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/product/get/:id', function (req, res) {
  /**
   * Captura de parametros de la url
   */
  var id = req.params.id;
  /**
   * los parametros dinamicos se asignan con ? y van en orden de aparicion en el vector
   * por ejemplo el primer ? se reemplaza por el valor de la variable id
   */
  connection.query("SELECT * FROM product WHERE id = ?", [id], function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/product/save/:name/:price', function (req, res) {
  /**
   * Captura de parametros de la url
   */
  var name = req.params.name;
  var price = req.params.price;
  /**
   * los parametros dinamicos se asignan con ? y van en orden de aparicion en el vector
   * por ejemplo el primer ? se reemplaza por null y el segundo ? se reemplaza por el valor de la variable name
   * [null, name, price] donde null es el id, lo ponemos null para que asigne el autoincrement
   */
  connection.query("INSERT INTO product (id, name, price) VALUES (?, ?, ?);", [null, name, price], function (err, result, fields) {
    if (err) throw err;
    if(result.affectedRows >= 1){
      res.json({insert: true});
    }else{
      res.json({insert: false});
    }
  });
});

app.get('/', function (req, res) {
  res.sendFile(
    path.join(__dirname, '/src/views/index.html')
  );
});

app.get('/exam1', function (req, res) {
  res.sendFile(
    path.join(__dirname, '/src/views/exam_step1.html')
  );
});
app.get('/exam2', function (req, res) {
  res.sendFile(
    path.join(__dirname, '/src/views/exam_step2.html')
  );
});

app.get('/companies', function (req, res) {
  connection.query("SELECT * FROM company", function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/questions', function (req, res) {
  connection.query("SELECT * FROM question", function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/exam/create', function (req, res) {
  var date = req.body.date;
  var company = req.body.company;
  connection.query("INSERT INTO exam (id, date, company) VALUES (?, ?, ?);", [null, date, company], function (err, result, fields) {
    if (err) throw err;
    if(result.affectedRows >= 1){
      res.json({insertID: result.insertId});
    }else{
      res.json({insertID: -1});
    }
  });
});

app.post('/exam/answer', function (req, res) {
  var data = req.body.data;
  var data = JSON.parse(data);
  var result = 1;
  for(i=0; i<data.length;i++){
    row = data[i];
    connection.query("INSERT INTO exam_question (exam, question, result) VALUES (?, ?, ?);", [row.exam, row.question, row.result], function (err, result, fields) {
      if (err) throw err;
      if(result.affectedRows >= 1){
        result = result * 1;
      }else{
        result = result * 0;
      }
    });
  }
  res.json({result: result});
});

/**
 * Init application
 */
app.listen(3000, function () { console.log('Running!'); });