var express = require('express');
var app     = express();
var path    = require("path");
var mysql = require('mysql');

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

/**
 * Init application
 */
app.listen(3000, function () { console.log('Running!'); });