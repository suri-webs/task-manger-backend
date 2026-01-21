
const mongoose = require('mongoose');
require("dotenv").config({
  quiet: true,
});
const mongoUri = process.env.MOMGOURI

function connectToDB(){
mongoose.connect(mongoUri).then((x)=>{
    console.log("Connection successFull");
    // return x
}).catch((err)=>{
    console.log(err.message ?? err);
    // return err
})
}



module.exports = {
    connectToDB
}