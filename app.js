//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to my Personal Blog! Through each post, I hope to share my thoughts on current events, entertainment, and what's going on in my life!";
const aboutContent = "Vinay Tummarakota is a student at Rice University studying Computer Science. He also has strong interests in politics and moral philosophy";
const contactContent = "Got any burning questions? Reach out to Vinay at sst7@rice.edu!";

const posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    if(err){
      console.log(err);
    }
    else {
      res.render("home", {homeStartingContent: homeStartingContent, posts: posts});
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent:aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent:contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save();
  res.redirect("/");
});

app.get("/posts/:postID", function(req, res){
  const postID = req.params.postID;
  Post.findById(postID, function(err, post){
    if(err){
      console.log(err);
    }
    else {
      res.render("post", {title: post.title, content: post.content}); 
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
