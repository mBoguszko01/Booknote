import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import session from "express-session"

const app = express();
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "booknotes",
    password: "admin",
    port: 5432,
})
const port = 3000;
const OPEN_LIBRARY_API_URL = "https://openlibrary.org/search.json?";

db.connect();



app.use(express.static('public'));
app.use(session({
    secret: 'tralala',
    resave: false,
    saveUninitialized: false
}));
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
    res.render("user_home.ejs", {
        user_id: req.session.userID,
        user_posts: req.session.userPosts
    })
})
app.post("/create_new_post.ejs", async (req,res)=>{
    console.log(req.session.userID);  
    res.render("create_new_post.ejs",{
        user_id: req.session.userID
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

    const checkUserName = (await db.query("SELECT * FROM users WHERE user_name = $1", [req_userName])).rows;
    try{
        if(req_pswd == checkUserName[0].password)
        {
            
            req.session.userID = checkUserName[0].id;
            req.session.userPosts = req.session.userPosts = (await db.query("SELECT id, user_id, title, author, rating, TO_CHAR(read, 'Mon dd, yyyy') AS read, notes , img_url FROM posts WHERE user_id = $1", [req.session.userID])).rows;
            console.log(req.session.userPosts);
            res.render("user_home.ejs", 
            {
                user_id: req.session.userID,
                user_posts: req.session.userPosts
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
    const userId = req.session.userID;
    const title = req.body.title;
    const author = req.body.author;
    const finishedReading = req.body.finishedReading;
    const rating = req.body.rating;
    const notes = req.body.notes;
    
    console.log(req.body);
    if(req.body.decision === 'Post'){
        try{
            const response = await axios.get(generateBookInfoLink(title));
            const coverEditionKey = response.data.docs[0].cover_edition_key;
            const imgURL = `https://covers.openlibrary.org/b/olid/${coverEditionKey}-L.jpg`;
            const finalImgURL = (await axios.head(imgURL, { maxRedirects: 5 })).request.res.responseUrl;
            console.log(finalImgURL);
            await db.query("INSERT INTO posts (user_id, title, author, rating, read, notes,img_url) VALUES ($1, $2, $3, $4, $5, $6, $7)",[userId, title, author, rating,finishedReading ,notes,finalImgURL]);
            console.log("Dodalismy post");
        }catch(error){
            console.log(error);
            console.log("Problemito");
        }
    }

    req.session.userPosts = (await db.query("SELECT id, user_id, title, author, rating, TO_CHAR(read, 'Mon dd, yyyy') AS read, notes , img_url FROM posts WHERE user_id = $1", [req.session.userID])).rows;
    console.log(req.session.userPosts);
    res.render("user_home.ejs", 
    {
            user_id: req.session.userID,
            user_posts: req.session.userPosts
    });
})
app.post("/edit_post", async (req,res)=>{
    console.log("Edytujemy posta");
    req.session.editPostId = req.body.edit_post_id;
    const postInfo = (await db.query("SELECT id, user_id, title, author, rating, TO_CHAR(read, 'Mon dd, yyyy') AS read, notes FROM posts WHERE id = $1", [req.body.edit_post_id])).rows;
    res.render("edit_post.ejs", 
    {
        title: postInfo[0].title,
        author: postInfo[0].author,
        finishedReading: postInfo[0].read,
        rating: postInfo[0].rating,
        notes:postInfo[0].notes
    });
})
app.post("/saveChangedPost", async (req,res)=>{
    if(req.body.decision === 'Save Changes'){
        const response = await axios.get(generateBookInfoLink(req.body.title));
        const coverEditionKey = response.data.docs[0].cover_edition_key;
        const imgURL = `https://covers.openlibrary.org/b/olid/${coverEditionKey}-L.jpg`;
        const finalImgURL = (await axios.head(imgURL, { maxRedirects: 5 })).request.res.responseUrl;
        await db.query("UPDATE posts SET title = $1, author = $2, rating = $3, read = $4, notes = $5 ,img_url = $6 WHERE id = $7",[req.body.title, req.body.author, req.body.rating, req.body.finishedReading, req.body.notes,finalImgURL,req.session.editPostId]);
    }
    req.session.userPosts = (await db.query("SELECT id, user_id, title, author, rating, TO_CHAR(read, 'Mon dd, yyyy') AS read, notes , img_url FROM posts WHERE user_id = $1", [req.session.userID])).rows;
    res.render("user_home.ejs", 
    {
        user_id: req.session.userID,
        user_posts: req.session.userPosts
    });

})
app.post("/del_post", async (req,res)=>{
    const deleteId = req.body.delete_post_id;
    await db.query("DELETE FROM posts WHERE id = $1", [deleteId]);
    console.log((db.query("SELECT id, user_id, title, author, rating, TO_CHAR(read, 'Mon dd, yyyy') AS read, notes FROM posts WHERE user_id = $1", [req.session.userID])).rows);
    req.session.userPosts = (await db.query("SELECT id, user_id, title, author, rating, TO_CHAR(read, 'Mon dd, yyyy') AS read, notes , img_url FROM posts WHERE user_id = $1", [req.session.userID])).rows;
    console.log(req.session.userPosts);
    res.render("user_home.ejs", 
    {
        user_id: req.session.userID,
        user_posts: req.session.userPosts
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

function generateBookInfoLink(title)
{
    title = title.replace(/\s+/g,'+');
    return `${OPEN_LIBRARY_API_URL}q=${title}&fields=key,title,author,editions,editions.key,editions.title,editions.ebook_access,editions.language,cover_edition_key&lang=eng&limit=1`
}
