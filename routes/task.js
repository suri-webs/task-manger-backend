const mongoose = require("mongoose");
const express = require("express");
const { isLoggedIn /*isAdmin*/ } = require("../middlewares/auth");
const { handleCreateTask, handleTaskForRelatedUser, handleUpdateTask } = require("../controller/task");

const taskRouter = express.Router();

// list all tasks based on user
taskRouter.post("/listTasks", isLoggedIn, handleTaskForRelatedUser);

// creates new task
taskRouter.post("/new", isLoggedIn, handleCreateTask);

// update task
taskRouter.patch("/update", isLoggedIn, handleUpdateTask);

// delete task
// taskRouter.put("/new", isLoggedIn, handleCreateTask);

// search tasks
// taskRouter.get("/search",isLoggedIn, handleSearchTask)

module.exports = taskRouter;
