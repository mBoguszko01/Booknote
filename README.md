# BookNote
BookNote is a web application prototype that allows users to store information about the books they have read, give ratings, and write notes.
## IMPORTANT
The application is a prototype. It runs on your machine locally and does not have many crucial elements that a real web app should have. <br>
It was created for study purposes.
## Features
* Sign up and Sign in system
* Adding new post
  * The application connects to the public [Open Library](https://openlibrary.org/) API in order to get the book covers.
* Editing post
* Deleting post

## Installation and Launch
You must have [Postgresql](https://www.postgresql.org/) installed and configured properly.
1. host name: 'localhost'
2. user: 'postgres'
3. password: 'admin'
4. port: 5432

After installing Postgres you have to create database called 'booknotes' and run query with this SQL code:
```
CREATE TABLE posts(
	id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	title TEXT,
	author TEXT,
	rating INT,
	read DATE,
	notes TEXT,
	img_url TEXT
);
CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	user_name VARCHAR(25),
	email VARCHAR(40),
	password VARCHAR(40),
	user_since DATE,
	profile_picture TEXT,
	books_read INT	
);
```
You also must have [NodeJS](https://nodejs.org/en) installed.
<br>Then using your terminal `cd` to project location and type `npm i` <br>
<br><b>Important</b> <br>
You must have nodemon installed globaly. To do that you can also use npm: <br>
`npm install -g nodemon`<br>
When all the packages download <br>`nodemon index.js`

* Application is now running on: `http://localhost:3000`
