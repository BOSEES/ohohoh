var mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST, // 엔드포인트
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // RDS 비밀번호
  database: process.env.DB_DATABASE,
});

module.exports = function (connection) {
  var sendQuery = function (query, callback, params = null) {
    connection.query(query, params, function (err, result) {
      if (err) return callback(err);
      callback(null, result);
    });
  };
  return {
    getUserList: function (callback) {
      sendQuery("SELECT * FROM users", callback);
    },
    getLoginUser: function (params, calback) {
      sendQuery(
        "SELECT * FROM users WHERE email=? and password=?",
        callback,
        params
      );
    },
    getUserEmail: function (params, callback) {
      sendQuery(`SELECT id from users WHERE email=?`, callback, params);
    },
    insertUser: function (params, callback) {
      sendQuery(
        `INSERT INTO users (email, password, age)
        VALUES (?, ?, ?)`,
        callback,
        params
      );
    },
    insertPost: function (params, callback) {
      sendQuery(
        `insert into posts (title, contents, user_id)
                values (?, ?, ?)`,
        callback,
        params
      );
    },
    getPostLogout: function (params, callback) {
      sendQuery(
        `
                SELECT p.post_id, p.title, u.email, p.user_id, p.view_count, 
                        p.likes, count(c.post_id) AS comment_count
                FROM posts AS p
                LEFT JOIN users AS u
                    ON p.user_id = u.id
                LEFT JOIN comments AS c
                    ON c.post_id = p.post_id
                GROUP BY c.post_id, p.post_id
                ORDER BY p.post_id ASC;
                `,
        callback,
        params
      );
    },
    getPostId: function (params, callback) {
      sendQuery(
        `select * from posts
        where user_id = ? and post_id = ?`,
        callback,
        params
      );
    },
    getPostUpdate: function (params, callback) {
      sendQuery(
        `update posts set title=?, contents=? where post_id=?`,
        callback,
        params
      );
    },
    getPostDelete: function (params, callback) {
      sendQuery(`delete from posts where post_id = ?`, callback, params);
    },
    getPostlike: function (params, callback) {
      sendQuery(`select likes from posts where post_id=?`, callback, params);
    },
    getPostlikes: function (params, callback) {
      sendQuery(
        `update posts set
        likes=? where post_id=?`,
        callback,
        params
      );
    },
    getPostComment: function (params, callback) {
      sendQuery(
        `insert into comments (description, user_id, post_id)
            values (?,?,?)`,
        callback,
        params
      );
    },

    //   connection.query("SELECT * FROM users", function (err, result) {
    //     if (err) return callback(err);
    //     callback(null, resilt);
    //   });
    //   },
  };
};
