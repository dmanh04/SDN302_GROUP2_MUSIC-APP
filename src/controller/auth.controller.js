const Users = require("../models/user.model");

exports.signIn = async (req, res) => {
  try {
    const { username, password, retypePassword } = req.body;
    Users.exists({ username: username });
     res.json({
      accessToken: "mádbasd",
      name: "manh",
    }); 
  } catch {
    
  }
};

exports.signUp = async (req, res) => {
  res.json({
    accessToken: "mádbasd",
    name: "manh",
  });
};
