const express = require('express');
const router = express.Router();

const createRouter = (db) => {

    router.get('/', (req, res) => {
        db.query("SELECT * FROM comments", (err, result) => {
            res.send(result);
        });
    });

    router.post('/', (req, res) => {
        const comment = req.body;
        if (comment.description === undefined) {
            res.status(400).send({"error": "text must be filled"});
        } else {
            db.query("INSERT INTO comments SET ?", [comment], (error, results) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                comment.id = results.insertId;
                res.send(comment);
            });
        }
    });

    router.delete('/:id', (req, res) => {
        db.query("DELETE FROM comments WHERE id = ?", [req.params.id], (err, result) => {
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