var express = require("express");
var router = express.Router();

//localhost/userRouter
router.get("/" , function(req, res, next){
    console.log("라우터 유저로 접속했습니다.");
    res.send("유저로 작성했습니다!");
});
// locahost/userRouter/profile
router.get("/profile" , function(req, res,next){
    console.log("프로파일로 접속했습니다.");
    res.send("프로파일로 작성했습니다.");
})

module.exports = router;