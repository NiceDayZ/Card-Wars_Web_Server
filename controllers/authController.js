const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const HttpStatusCodes = require("http-status-codes");

const User = require('../models').User;

const login = async (req, res) => {
    console.log(req.body);
    try {
      const { email, password } = req.body;
  
      const user = await req.db.User.findOne({
        email
      });
  
      if (!user) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Email or password incorrect"
        });
      }

      //check if password is correct
      const validPass = await bcrypt.compare(password, user.password);

      if(!validPass) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Email or password incorrect"
        });
      }

      //Create and assign a token
      const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        token: token
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something bad happen!"
      });
    }
  };


  const register = async (req, res) => {
    //Check if the user is already in the database. If not send 409 Conflict and reject request
    try {
      const existingUser = await req.db.User.findOne({
        email: req.body.email
      })
  
      if (existingUser) {
        return res.status(HttpStatusCodes.CONFLICT).json({
          success: false,
          message: "User already exists!"
        })
      }

      //Hash passwords
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      //Create a new User using given data from Mobile or Web App
      const createdUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
      });
  
      const user = await req.db.User.create(createdUser);

  
      return res.status(HttpStatusCodes.CREATED).json({
        success: true
      })
    } catch (error) {
      console.error(error);
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something bad happened!"
      });
    }
  };

module.exports = {
    login,
    register
}