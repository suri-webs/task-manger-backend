const mongoose = require('mongoose');
const express = require('express');
const { handleLogin, handleLogout } = require('../controller/auth');


const authRouter = express.Router();



authRouter.post('/login', handleLogin);
// authRouter.post('/logout',handleLogout);

module.exports = authRouter;
