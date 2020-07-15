var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var port = 3333;
var path = require('path');
var session = require('express-session');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'kytrk*()*^*$%^#$Hhtrd.hggfsgg#@$#@^#$^J@$',
        resave: false,
        saveUninitialized: true
    })
);

var mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'blockchain2102',
    database: 'test'
})

app.get('/', function(req, res){
    res.render('home', { email: req.session.email });
});

app.get('/login', function(req, res) {
    res.render('login', { error: false, email: req.session.email });
});

app.post('/login', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    connection.query(
        `SELECT * from users WHERE email=? and password=?`,
        [email, password],
        function(err, users) {
            if ( err ) {
                console.log(err); // 오류
            } else if ( users.length > 0 ) { // users 값이 있음
                req.session.email = email;
                res.redirect('/');
            } else { // users 값이 없음 (빈 list)
                res.render('login', { error: true, email: req.session.email });
            }
        }
    )
});

app.get('/signup', function(req, res) {
    res.render('signup', { errorMessage: null, email: req.session.email });
});

app.post('/signup', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    var age = null;
    if ( req.body.age ) {
        age = req.body.age
    }

    connection.query(
        `SELECT id from users WHERE email=?`, // email이 같은 user의 id 찾기
        [email],
        function(err, users) {
            if ( err ) { // 오류 발생
                res.render('signup', { errorMessage: "오류 발생", email: req.session.email });
            } else if (users.length > 0) { // 이미 존재하는 이메일
                res.render('signup', { errorMessage: "이미 존재하는 이메일", email: req.session.email });
            } else { // email이 `users` table에 없을 경우
                connection.query(
                    `INSERT INTO users (email, password, age)
                        VALUES (?, ?, ?)`,
                    [email, password, age],
                    function(err2, result) {
                        if ( err2 ) { // 오류 발생
                            res.render('signup', { errorMessage: "생성 오류", email: req.session.email });
                        } else { // INSERT 성공
                            res.render('login', { error: false, email: req.session.email })
                        }
                    }
                )
            }
        }
    )
});

app.get('/logout', function(req, res) {
    if (req.session.email) { // 로그인 정보가 있으면 
        req.session.destroy(function(err) {
            if ( err ) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        })
    } else {
        res.redirect('/');
    }
})

// localhost:3333/list
// app.get(`URL`, function )
// connection.query(`QUERY`, function)
app.get('/list', function(req, res) {
    connection.query('SELECT * from users', function(err, rows) {
        if ( err ) {
            console.log(err);
        }
        res.render('list', { users: rows, email: req.session.email });
    })
});

server.listen(port, function() {
    console.log('웹 서버 시작', port);
});