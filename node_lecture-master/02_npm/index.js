var http = require("http");
var express = require("express");
var path = require('path');
var app = express();
var server = http.createServer(app);
var port = 3333;

server.listen(port, function() {
    console.log("웹 서버 시작", port);
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // ejs , ... 

app.get('/', function(req, res){
    res.send('Hello world');
})

app.get('/page2', function(req, res){
    res.send('Page 2');
})

// http://localhost:3333/pug
app.get('/pug', function (req, res) {
    res.render('index', { title: 'pug' });
})

// http://localhost:3333/pug/aaaannnnnnn 
// :title로 받아온 text = req.params.title
app.get('/pug/:title/:id', function (req, res) {
    console.log('params ->', req.params);
    console.log('title ->', req.params.title);
    res.render('index', { 
        pug_title: req.params.title, 
        id: req.params.id 
    })
})

// http://localhost:3333/home
app.get('/home', function (req, res) {
    res.render('home', { pug_title: 'HOME!!!!!' });
});