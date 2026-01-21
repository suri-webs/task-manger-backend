const mongoose = require('mongoose');
const express = require('express');
const { serverCheck } = require('../controller');

const homeRouter = express.Router();

homeRouter.get("/",serverCheck)


module.exports = homeRouter