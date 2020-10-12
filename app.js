
const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate=require("mongoose-findorcreate");
const bcrypt=require("bcrypt");
// const ejsLint = require('ejs-lint');
const saltrounds=10;
var username;
var aadharnum;
var emailid;
var phonenom;

mongoose.connect('mongodb://localhost:27017/VirQue', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const UserSchema = new mongoose.Schema({
  Email: String,
  Name:String,
  Aadhar:String,
  PhoneNum:Number,
  Password: String,
});

const ShopSchema=new mongoose.Schema({
  Name: String,
  slots: Number,
  Location: String,
  Time:[String]
});

const User = new mongoose.model("User", UserSchema);
const Shop = new mongoose.model("Shop",ShopSchema);

const app=express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({
  extended: true
}));
app.get("/",function(req,res){
  res.render("index");
});
app.get("/about",function(req,res){
  res.render("about");
});
app.get("/contact",function(req,res){
  res.render("contact");
});
app.get("/signup",function(req,res){
  res.render("signup");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/slot",function(req,res){
  res.render("slot");
});
app.get("/shop",function(req,res){
  res.render("shop");
});
app.get("/slotpage",function(req,res){
  res.render("slotpage");
});
app.get("/booking",function(req,res){
  res.render("book");
})


app.post("/login",function(req,res){
  const num=req.body.num;
  const password=req.body.password;
  User.findOne({PhoneNum:num},function(err,found){
    if(err){
      console.log(err);
    }
    else{
      if(found){
        bcrypt.compare(password, found.Password, function(err, result) {
    if (result === true) {
      username=found.Name;
      emailid=found.Email;
      aadharnum=found.Aadhar;
      phonenom=found.PhoneNum;
    res.render("home");
  }else{
    console.log("Wrong Password");
    res.render("error");
  }
});
}else{
  console.log("Not Found");
}
    }
  })
});
app.post("/signup",function(req,res){
  const pass=req.body.password;
    bcrypt.hash(pass,saltrounds,function(err,hash){
      const newUser=new User({
        Email: req.body.email,
        Name:req.body.name,
        Aadhar:req.body.aadhar,
        PhoneNum:req.body.phone,
        Password: hash,
      });
      emailid= req.body.email,
      username=req.body.name,
      aadharnum=req.body.aadhar,
      phonenom=req.body.phone,
      newUser.save(function(err){
        if(err)
        console.log(err);
        else
        res.render("home");
      })
    });
});
app.post("/slot",function(req,res){
  console.log(req.body.search);
  t=req.body.time;
  Shop.find({"Location":req.body.search},function(err,found){
    if(!err){
      if(found.length>0){
      console.log(found);
       res.render("slotpage",{place:req.body.search,items:found});
     }else{
       res.render("notfound",{place:req.body.search});
     }
}else{
      console.log(err);
      res.render("error");
    }
  });
});
app.post("/shop",function(req,res){
  const newShop=new Shop({
    Name: req.body.name,
    slots: req.body.slots,
    Location: req.body.Loc,
  });
  newShop.save(function(err){
    if(err)
    console.log(err);
    else
    res.render("home");
  })
})

app.post("/slotpage",function(req,res){
  sname=req.body.button;
Shop.find({"Name":sname},function(err,yes){
  if(!err){
  time=yes[0].Time;
  res.render("book",{sname:sname,time:time});
  }
});
});

app.post("/book",function(req,res){
  people=req.body.nom;
  stime=req.body.stime;
  console.log(req.body.stime);
  res.render("confirm",{username:username,emailid:emailid,aadharnum:aadharnum,phonenom:phonenom,people:people,stime:stime});
});

app.listen(4500,function(err){
  if(!err){
    console.log("@4500!")
  }else{
    console.log(err);
  }
});

