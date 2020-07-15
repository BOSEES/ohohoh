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
    .get(function (req, res, next) {
      const postId = req.params.postId;
      connection.query(
        `
            select post_id, title, contents, email, user_id, view_count 
                from posts
                left join users
                on user_id = users.id
                where post_id = ?
        `,
        [postId],
        function (err, posts) {
          if (err) {
            res.render("error");
          } else if (posts.length < 1) {
            console.log("post가 없음");
            res.render("error");
          } else {
            connection.query(
              `select comment_id, description, user_id, email from comments
                        left join users
                        on user_id = users.id
                        where post_id = ?
                        order by comment_id desc`,
              [postId],
              function (err, comments) {
                if (err) {
                  res.render("error");
                } else {
                  console.log(comments);
                  const target = posts[0];
                  if (target.user_id == req.session.loggedIn.id) {
                    res.render("post", {
                      user: req.session.loggedIn,
                      post: posts[0],
                      comments: comments,
                    });
                  } else {
                    connection.query(
                      `update posts set
                                        view_count=? where post_id=?`,
                      [target.view_count + 1, postId],
                      function (err, result) {
                        if (err) {
                          res.render("error");
                        } else {
                          res.render("post", {
                            user: req.session.loggedIn,
                            post: posts[0],
                            comments: comments,
                          });
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        }
      );
    });

  router
    .route("/edit/:postId")
    .all(function (req, res, next) {
      if (!req.session.loggedIn) {
        res.redirect("/logout");
      } else {
        next();
      }
    })
    .get(function (req, res, next) {
      const postId = req.params.postId;
      getPostId([req.session.loggedIn.id, postId], function (err, rows) {
        if (err) {
          console.log(err);
          res.render("error");
        } else if (rows.length < 1) {
          res.render("error");
        } else {
          res.render("editPost", {
            user: req.session.loggedIn,
            post: rows[0],
            action: "/post/edit/" + postId,
          });
        }
      });
    })
    .post(function (req, res, next) {
      const postId = req.params.postId;
      const title = req.body.title;
      const contents = req.body.contents;
      getPostUpdate([title, contents, postId], function (err, result) {
        if (err) {
          res.render("error");
        } else {
          res.redirect("/posts");
        }
      });
    });

  router
    .route("/delete/:postId")
    .all(function (req, res, next) {
      if (!req.session.loggedIn) {
        res.redirect("/logout");
      } else {
        next();
      }
    })
    .get(function (req, res, next) {
      const postId = Number(req.params.postId);
      getPostDelete([postId], function (err, result) {
        if (err) {
          console.log(err);
          res.render("error");
        } else {
          res.redirect("/posts");
        }
      });
    });

  router
    .route("/like/:postId")
    .all(function (req, res, next) {
      if (!req.session.loggedIn) {
        res.redirect("/logout");
      } else {
        next();
      }
    })
    .get(function (req, res, next) {
      const postId = req.params.postId;
      getPostlike([postId], function (err, posts) {
        if (err) {
          res.render("error");
        } else if (posts.length < 1) {
          res.render("error");
        } else {
          const target = posts[0];
          getPostlikes([target.likes + 1, postId], function (err, result) {
            if (err) {
              res.render("error");
            } else {
              res.redirect("/posts");
            }
          });
        }
      });
    });

  return router;
};
