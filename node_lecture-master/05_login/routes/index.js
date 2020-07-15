var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "사용자 관리" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: false });
});

router.post("/login", function (req, res, next) {
  // res.render("login", { title: "로그인" });
  console.log(req.body);
  const username = req.body.id;
  const password = req.body.password;

  if (username === "test" && password == "1234") {
    res.redirect("/");
  } else {
    res.render("login", { error: true });
  }
});

router.get("/signup", function (req, res, next) {
  res.render("signup", { title: "회원가입" });
});

module.exports = router;
