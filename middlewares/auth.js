const jwt = require("jsonwebtoken");
const restrictedForUser = ["/user/new","/user/listUsers"];

function isLoggedIn(req, res, next) {
  try {
    const requestHeaders = req.headers["authorization"];
    const token = requestHeaders.split(" ")[1] || null;

    console.log("token ==========================>",token)
    // console.log(JSON.stringify(token))



    if (!token) {
      // throw new Error('Token not found')


      console.log("inside middleware ",token)
      return res.status(404).json({ message: "token not found" });
    }

    
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(401).json({ message: "token expired" });
    }

    // set user to body
    req.userData = user;

    // checks if user is authorized for this Route
    if (user.role === "user") {
      if (restrictedForUser.some((item) => item === req.originalUrl)) {
        console.log("UnAuthorized");
        return res.status(401).json({ message: "UnAuthorized" });
      }
    }
    console.log(`Accessible to ${user.role}`);
    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//  checks for current user is admin

// async function isAdmin(req,res){
//   try {
//     const user
//   } catch (error) {
//     console.log(error)
//   }
// }


module.exports = {
  isLoggedIn,
  // isAdmin,
};
