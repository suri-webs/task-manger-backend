const mongoose = require("mongoose");
const express = require("express");
const { handleCreateUser, handleAllGetUsers, handleGetUser, handleUpdateUser, handleDeleteUser } = require("../controller/user");
const { isLoggedIn /*isAdmin*/ } = require("../middlewares/auth");

const userRouter = express.Router();

// creates new user
userRouter.get("/listUsers", isLoggedIn, handleAllGetUsers);
userRouter.get("/profile", isLoggedIn, handleGetUser);
userRouter.post("/new", handleCreateUser);
userRouter.patch('/profile', isLoggedIn, handleUpdateUser);
userRouter.delete('/delete', isLoggedIn, handleDeleteUser);
module.exports = userRouter;
