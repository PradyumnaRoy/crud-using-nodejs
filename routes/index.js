var express = require('express');
var router = express.Router();

const path = require('path');
const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


/* routes */
router.get('/', function (req, res, next) {
  res.render("index");
  
});
router.get('/login', function (req, res, next) {
  res.render("login");
  
});

router.get('/logout', function (req, res, next) {
  res.cookie("token", "");
  res.redirect("/");
});

router.post('/create',  function (req, res, next) {
  let { name, email,password, age  } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      console.log(hash);
      await userModel.create({
        name,
        email,
        password:hash,
        age
      })
      let token = jwt.sign({email},"lolopopo");
      res.cookie("token", token);
    })
  })


});

router.post('/login',async function (req, res, next) {
  let user = await userModel.findOne({ email: req.body.email});
  if(!user) {
    return res.send("User not found");
  }
  let password = req.body.password;
  console.log(password, user.password);
  let hash = user.password;
  bcrypt.compare(password, hash, (err, result) => {
    if (result) {
      let token = jwt.sign({email:user.email},"lolopopo");
      res.cookie("token", token);
      res.send("You are authorized");
    } else {
      res.send("You are not authorized");
    }
  })
  
}); 

module.exports = router