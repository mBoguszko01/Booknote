import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "booknotes",
    password: "admin",
    port: 5432,
})
const port = 3000;
db.connect();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
    res.render("index.ejs");
});

app.get("/sign_up.ejs", (req,res)=>{
    res.render("sign_up.ejs");
})
app.get("/sign_in.ejs", (req,res)=>{
    res.render("sign_in.ejs");
})
app.get("/user_home.ejs",(req,res)=>{
    res.render("user_home.ejs")
})
app.post("/create_new_post.ejs", async (req,res)=>{
    console.log(req.body);  
    res.render("create_new_post.ejs",{
        user_id: req.body.user_id
    })
})

app.get("/profile.ejs", (req,res)=>{
    res.render("profile.ejs");
})
app.get("/settings.ejs", (req,res)=>{
    res.render("settings.ejs");
})

app.post("/login", async (req,res)=>{
    const req_userName = req.body.username;
    const req_pswd = req.body.password;
    const req_userId = req.body.id;
    console.log(req.body);

    const checkUserName = (await db.query("SELECT * FROM users WHERE user_name = $1", [req_userName])).rows;

    try{
        if(req_pswd == checkUserName[0].password)
        {
            const userPosts = (await db.query("SELECT * FROM posts WHERE user_id = $1", [checkUserName[0].id])).rows;
            console.log(userPosts);
            res.render("user_home.ejs", 
            {
                user_id: checkUserName[0].id,
                user_user_name: checkUserName[0].user_name,
                user_profile_picture: checkUserName[0].profile_picture,
                user_posts: userPosts
            });
        }
        else{
            console.log("Wrong username or password");
            res.render("sign_in.ejs");
        }
    }catch(error){
        console.log(error)
        res.render("sign_in.ejs");
    }
   
    
})
app.post("/register", async (req,res)=>{
    
    if(req.body.password === req.body.confirmPswd)
    {
        const newUser = new User(req.body.username, req.body.email, req.body.password, new Date().toJSON().slice(0, 10), "/assets/images/circle-user-solid.svg", 0);
        try{
            await db.query("INSERT INTO users (user_name, email, password, user_since, profile_picture, books_read) VALUES ($1, $2, $3, $4, $5, $6)",[newUser.username, newUser.email, newUser.password, newUser.userSince, newUser.profilePictureAddress, newUser.booksRead]);
            console.log("dodalismy");
            console.log(newUser);
        }catch(error)
        {
            console.log(error);
        }
        res.render("sign_in.ejs");
    }
    else{
        console.log("Passwords do not match!")
        res.render("sign_up.ejs");
    }

    
})
app.post("/createNewPost", async (req,res)=>{
    const userId = getUserId(req.body.user_id);
    const title = req.body.title;
    const author = req.body.author;
    const finishedReading = req.body.finishedReading;
    const rating = req.body.rating;
    const notes = req.body.notes;
    console.log(req.body);
    try{
        await db.query("INSERT INTO posts (user_id, title, author, rating, read, notes) VALUES ($1, $2, $3, $4, $5, $6)",[userId, title, author, rating,finishedReading ,notes]);
        console.log("Dodalismy post");
    }catch(error){
        console.log(error);
        console.log("Problemito");
    }
    res.render("user_home.ejs",{
        user_id: userId
    });
})
app.post("/edit_post", (req,res)=>{
    console.log(req.body);
    res.render("edit_post.ejs", 
    {
        title: req.body.title,
        author: req.body.author,
        finishedReading: req.body.finishedReading,
        rating: req.body.rating,
        notes: req.body.notes
    });
})
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})

class User {
    constructor(username, email, password, userSince, profilePictureAddress, booksRead){
        this.username = username;
        this.email = email;
        this.password = password;
        this.userSince = userSince;
        this.profilePictureAddress = profilePictureAddress;
        this.booksRead = booksRead;
    }
}
function getUserId(reqBody){
    const separeted = reqBody.split(" ");
    return separeted[1];
}