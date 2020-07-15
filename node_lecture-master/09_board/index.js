var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var port = 3333;
var path = require("path");
var session = require("express-session");
require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
var db = require("./db")(connection);

var indexRouter = require("./routes/index")(db);
app.use("/", indexRouter);

var postsRouter = require("./routes/posts")(db);
app.use("/posts", postsRouter);

var postRouter = require("./routes/post")(db);
app.use("/post", postRouter);

var commentRouter = require("./routes/comment")(db);
app.use("/comment", commentRouter);

server.listen(port, function () {
  console.log("웹 서버 시작", port);
});
