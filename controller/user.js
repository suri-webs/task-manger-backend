const mongoose = require("mongoose");
const userModel = require("../model/user.js");
const bcrypt = require("bcryptjs")
// create user
async function handleCreateUser(req, res) {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.send("please enter all the details");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      username,
      password: hashPassword,
      role,
    });

    return res.json(newUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// all users
async function handleAllGetUsers(req, res) {
  try {
    const users = await userModel.find({ "role": "user" });

    return res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function handleGetUser(req, res) {

  try {
    const currentUser = req.userData;
    const user = await userModel.findById(currentUser.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }

}

async function handleUpdateUser(req, res) {

  try {

    const currentUser = req.userData;
    const { id } = req.query;
    const { username, password } = req.body;


    let userToUpdate = await userModel.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({ error: "User not found" });
    }


    if (userToUpdate._id.toString() !== currentUser.id) {
      return res.status(401).json({ error: "Unauthorized to update this user" });
    }

    const updateData = { updatedAt: Date.now() };

    if (username && username !== userToUpdate.username) {

      const usernameExists = await userModel.findOne({ username });

      if (usernameExists && usernameExists._id.toString() !== id) {
        return res.status(400).json({ error: "Username already exists" });
      }

      updateData.username = username;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      updateData.password = hashPassword;
    }


    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.json({
      data: {
        updatedUser: {
          _id: updatedUser._id,
          username: updatedUser.username,
          role: updatedUser.role
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
}
async function handleDeleteUser(req, res) {
  try {

    const currentUser = req.userData;
    const { id } = req.query;

    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can delete users" });
    }

    if (userToDelete._id.toString() === currentUser.id) {
      return res.status(403).json({ error: "You cannot delete your own account" });
    }

    if (userToDelete.role === 'admin') {
      return res.status(403).json({ error: "You cannot delete another admin account" });
    }

    await userModel.findByIdAndDelete(id);

    return res.json({
      message: "User deleted successfully",
      deletedUser: {
        _id: userToDelete._id,
        username: userToDelete.username,
        role: userToDelete.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
}

module.exports = {
  handleCreateUser,
  handleAllGetUsers,
  handleGetUser,
  handleUpdateUser,
  handleDeleteUser
};
