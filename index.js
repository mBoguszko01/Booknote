import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

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
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})