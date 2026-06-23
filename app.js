const express = require('express');
const app = express();
const mongoose=require("mongoose");
const hbs = require('hbs')
const path=require("path");
const loginCollection = require('./mongoose')

const templatePath = path.join(__dirname,'templates')

app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","hbs");
app.set("views",templatePath);
app.use(express.urlencoded({extended:false}))


app.post("/signup",async(req,res)=>{
    const data = {
        name : req.body.name,
        password: req.body.password
    }

    await loginCollection.insertMany([data]);

    res.render("index");
})

app.post("/login",async(req,res)=>{
  try{
    const check = await loginCollection.findOne({name:req.body.name})

    if(check.password === req.body.password)
    {
        res.render("index")
    }
    else
    {
        res.send("wrong password")
    }
  }
  catch{
    res.send("wrong details");
  }
})


app.listen('3040',()=>{
    console.log(`listening to the port 3040`);
})

app.get("/signup",(req,res) =>{
    res.render("signup")
})

app.get("/",(req,res)=>{
    res.render("login")
})
