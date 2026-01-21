const userModel = require("../model/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// login handler
async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;
    console.log(req.body)

    const user = await userModel.findOne({ username: username });

    console.log(user)

    // check for user existence in DB
    if (!user) {
      return res.status(204).json({ message: "No user found with this username" });
    }

    //  compare password with the hash stored in user // 

    if (!password) {
      return res.status(400).json({ message: "password not found in request body" })
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {

      return res.status(401).json({ message: "Password didn't match" });
    }

    //   creating token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.json({ message: "Login Success", token: token, username: user.username, role: user.role });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

function handleLogout(req, res) {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out Successfully !" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.mesasge })
  }
}

module.exports = {
  handleLogin,
  handleLogout,
};
