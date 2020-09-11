const express=require('express');
const bodyparser=require('body-parser');

const app=express();
app.set('view engine','ejs');
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("home");
});

app.get("/about",function(req,res){
  res.render("about");
});
app.get("/contact",function(req,res){
  res.render("contact");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/signup",function(req,res){
  res.render("signup");
});
app.listen(4500,function(err){
  if(!err){
    console.log("@4500!")
  }else{
    console.log(err);
  }
});
