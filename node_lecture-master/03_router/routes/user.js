//라우터 기능을 사용하는 기본적인 변수선언 require 는 노드제이에스에서 모듈을 가져오고 싶을때 사용하는 메소드이다.
var express = require("express");
var router = express.Router();

// localhost:3333/user
router.get('/', function (req, res, next) {
    res.send('USER !')
})

// localhost:3333/user/profile
router.get('/profile', function (req, res, next) {
    res.send('USER PROFILE')
})

module.exports = router;