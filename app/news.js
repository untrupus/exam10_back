const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const config = require("../config");
const {nanoid} = require('nanoid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const createRouter = (db) => {

    router.get('/', (req, res) => {
        db.query("SELECT * FROM news", (err, result) => {
            res.send(result);
        });
    });

    router.get('/:id', (req, res) => {
        db.query("SELECT * FROM news WHERE id = ?", [req.params.id], (err, result) => {
            if (err) return res.sendStatus(400);
            res.send(result);
        });
    });

    router.post('/', upload.single("image"), (req, res) => {
        const news = req.body;
        news.datetime = new Date();
        if (req.file) {
            news.image = req.file.filename;
        }
        if (news.title === undefined || news.news_text === undefined) {
            res.status(400).send({"error": "Title and id must be filled"});
        } else {
            db.query("INSERT INTO news SET ?", [news], (error, results) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                news.id = results.insertId;
                res.send(news);
            })
        }
    });

    router.delete('/:id', (req, res) => {
        db.query("DELETE FROM news WHERE id = ?", [req.params.id], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(400)
            }
            res.send('success');
        });
    });
    return router;
};

module.exports = createRouter;