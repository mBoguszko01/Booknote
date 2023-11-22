import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

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
app.get("/create_new_post.ejs",(req,res)=>{
    res.render("create_new_post.ejs")
})

app.get("/profile.ejs", (req,res)=>{
    res.render("profile.ejs");
})
app.get("/settings.ejs", (req,res)=>{
    res.render("settings.ejs");
})

app.post("/login", (req,res)=>{
    console.log(req.body);
    res.render("user_home.ejs");
})
app.post("/register", (req,res)=>{
    console.log(req.body);
    res.render("sign_in.ejs");
})
app.post("/creatNewPost", (req,res)=>{
    console.log(req.body);
    res.render("user_home.ejs");
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