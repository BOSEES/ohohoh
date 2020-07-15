var express = require("express");
var router = express.Router();

module.exports = function (connection) {
  router
    .route("/:postId")
    .all(function (req, res, next) {
      if (!req.session.loggedIn) {
        res.redirect("/logout");
      } else {
        next();
      }
    })
    .post(function (req, res, next) {
      const postId = req.params.postId;
      const description = req.body.desc;
      getPostComment([description, req.session.loggedIn.id, postId], function (
        err,
        result
      ) {
        if (err) {
          res.render("error");
        } else {
          res.redirect("/post/" + postId);
        }
      });
    });
  return router;
};
