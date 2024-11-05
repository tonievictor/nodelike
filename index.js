import express from "express";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("likes.db");

const app = express();

app.get("/", (req, res) => {
	res.send("Hello world");
})

app.post("/likes/:id", async (req, res) => {
	const articleId = '1' || req.params['id']; // guard, since we're not focused on user creation
	try {
		const article = await run(db, findArticle, articleId);
		const userid = "1" // Ideally we can take this from the session token, jwt etc
		if (!article) {
			res.status(404).json({ message: `Article with ${articleId} not found` });
			return
		}
		const like = await run(db, createLike, [userid, articleId]);
		if (!like) {
			res.status(422).json({ message: "Unable to like post" });
			return
		}
		res.status(200).json({ message: "Successfully liked post", data: like });
	} catch (e) {
		res.status(501).json({ message: "Internal server error" });
		console.log("An error occured")
		console.log(e);
	}

})

app.listen(3000, async () => {
	try {
		await execute(db, createtables)
		await execute(db, createUser, ["John Doe"])
		await execute(db, createArticle, [1, 'Hello world'])
		console.log("Server is listening on port 3000");
	} catch (e) {
		console.log("An error occured while setting up.");
		console.log(e);
	}
})


// sql wrapper functions
async function execute(db, sql, params = []) {
	if (params && params.length > 0) {
		return new Promise((resolve, reject) => {
			db.run(sql, params, (err, row) => {
				if (err) reject(err);
				resolve(row);
			});
		});
	}
	return new Promise((resolve, reject) => {
		db.exec(sql, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
};

async function run(db, sql, params) {
	return new Promise((resolve, reject) => {
		db.get(sql, params, (err, row) => {
			if (err) reject(err);
			resolve(row);
		});
	});
};

// sql query strings
const createtables = ` 
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
	created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS articles (
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled',
  body TEXT DEFAULT '',
  user_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS likes (
	id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  article_id INTEGER NOT NULL,
	created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (article_id) REFERENCES articles (id)
);
`

const findArticle = `SELECT * FROM articles WHERE id = ?;`;
const createLike = `INSERT INTO likes(user_id, article_id) VALUES (?, ?) RETURNING *;`;
const createArticle = `INSERT INTO articles(user_id, body) VALUES (?, ?);`;
const createUser = `INSERT INTO users(name) VALUES(?);`;
