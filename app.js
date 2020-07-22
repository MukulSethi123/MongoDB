//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { kebabCase } = require("lodash");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });

const homeStartingContent = "Welcome to my blog webiste, my key focus while designing this website is the data retention and designing, as these are the most essential components of anywebsite. this website has also helped me learn about mongoDB and the mongoose framework. I hope you find this site visually pleasing and interactive as have intended it to be. Thank You. enjoy ........... Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque.";
const aboutContent = "I am a computer science student from Jain University Banglore. 21 and Over is still a fun movie. music and arts are the the absolute necessity. Coding is fun :) yet frustrating ):............ Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero"  ;
const contactContent = "I really dont wanna poulate this so here is some loren Ipsum hope you enjoy :). Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

//records all the posts
//change date data type to string
const PostSchema = mongoose.Schema({
    title: String,
    body: String,
    month: Number,
    year: Number
});
const Post = mongoose.model("post", PostSchema);

// const accountSchema = mongoose.Schema({
//     user_name: String,
//     password: String,
//     posts:[postSchema]
// });

const date = new Date();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", function(req, res) {
    Post.find({}, function(err, allPosts) {
        if (!err) {
            res.render("home", { homeContent: homeStartingContent, posts: allPosts, lodash: _ });
        } else
            console.log(err);
    });

});

app.get("/about", function(req, res) {
    res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function(req, res) {
    res.render("contact", { contactContent: contactContent })
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

app.get("/posts/:postid", function(req, res) {
    let postsId = req.params.postid;
    Post.findById(postsId, function(err, post) {
        if (!err)
            res.render("post", { post: post });
        else
            console.log("error rendering posts: " + err);
    })

})
app.post("/compose", function(req, res) {

    const posts = new Post({
        title: req.body.post_title,
        body: req.body.post_message,
        month: date.getMonth() + 1,
        year: date.getFullYear()
    });
    posts.save(function(err) {
        if (!err) {
            res.redirect("/");
        } else {
            console.log("error occured in /compose" + err);
        }
    });

});

//bug report: 1 deleteOne (_id: ...)
// the _id doesnt work 
app.post("/delete", function(req, res) {

    const object = req.body.deleteId;

    Post.deleteOne({ id: object._id }, function(err) {
        if (!err) {
            console.log("deletion successful");
            res.redirect("/");
        } else
            console.log("unable to delete: " + err);
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});