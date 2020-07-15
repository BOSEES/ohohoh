var express = require("express");
var router = express.Router();

module.exports = function (connection) {
  var db = require("../db")(connection);
  router.get("/", function (req, res, next) {
    res.render("home", { user: req.session.loggedIn });
  });

  router
    .route("/login")
    .get(function (req, res, next) {
      res.render("login", { error: false, user: req.session.loggedIn });
    })
    .post(function (req, res, next) {
      const email = req.body.email;
      const password = req.body.password;
      db.getLoginUser([email, password], function (err, users) {
        if (err) {
          console.log(err); // 오류
          res.render("error");
        } else if (users.length > 0) {
          // users 값이 있음
          req.session.loggedIn = users[0];
          res.redirect("/");
        } else {
          // users 값이 없음 (빈 list)
          res.render("login", { error: true, user: req.session.loggedIn });
        }
      });
    });

  router
    .route("/signup")
    .get(function (req, res, next) {
      res.render("signup", { errorMessage: null, user: req.session.loggedIn });
    })
    .post(function (req, res, next) {
      const email = req.body.email;
      const password = req.body.password;
      var age = null;
      if (req.body.age) {
        age = req.body.age;
      }

      getUserEmail([email], function (err, users) {
        if (err) {
          // 오류 발생
          res.render("signup", {
            errorMessage: "오류 발생",
            user: req.session.loggedIn,
          });
        } else if (users.length > 0) {
          // 이미 존재하는 이메일
          res.render("signup", {
            errorMessage: "이미 존재하는 이메일",
            user: req.session.loggedIn,
          });
        } else {
          // email이 `users` table에 없을 경우
          insertUser([email, password, age], function (err2, result) {
            if (err2) {
              // 오류 발생
              res.render("signup", {
                errorMessage: "생성 오류",
                user: req.session.loggedIn,
              });
            } else {
              // INSERT 성공
              res.render("login", {
                error: false,
                user: req.session.loggedIn,
              });
            }
          });
        }
      });
    });

  router.route("/logout").get(function (req, res, next) {
    if (req.session.loggedIn) {
      // 로그인 정보가 있으면
      req.session.destroy(function (err) {
        if (err) {
          console.log(err);
          res.render("error");
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/");
    }
  });

  router.route("/list").get(function (req, res, next) {
    db.getUserList(function (err, rows) {
      if (err) {
        console.log(err);
        res.render("error");
      } else {
        res.render("list", { user: rows, user: req.session.loggedIn });
      }
    });
    // connection.query("SELECT * from users", function (err, rows) {
    //   if (err) {
    //     console.log(err);
    //     res.render("error");
    //   } else {
    //     res.render("list", { users: rows, user: req.session.loggedIn });
    //   }
    // });
  });

  return router;
};
