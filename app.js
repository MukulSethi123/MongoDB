//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { kebabCase } = require("lodash");
const date = require(__dirname + "/date.js");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

//records all the posts
//change date data type to string
const PostSchema = mongoose.Schema({
    title: String,
    body: String,
    date: String
});
const Post = mongoose.model("post", PostSchema);

// const accountSchema = mongoose.Schema({
//     user_name: String,
//     password: String,
//     posts:[postSchema]
// });

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
        date: date.getDate()
    });
    console.log(date.getDate());
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