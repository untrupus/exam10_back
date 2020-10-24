const express = require("express");
const app = express();
const mysql = require("mysql");
const news = require("./app/news");
const comments = require("./app/comments");
const port = 8000;
const config = require("./config");

const connection = mysql.createConnection(config.db);

app.use(express.json());
app.use(express.static('public'));
app.use("/news", news(connection));
app.use("/comments", comments(connection));

connection.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log("Connected");
    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
});