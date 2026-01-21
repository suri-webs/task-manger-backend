

function serverCheck(req,res){
    res.json({"message":'Server Running Fine'});
    // res.send("<h1 style='color:white;background:black'>This is a server rendered html, sent as a</h1>")
}


module.exports = {
    serverCheck,
}