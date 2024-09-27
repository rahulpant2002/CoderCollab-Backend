const adminAuth = (req, res, next)=>{
    const adminToken = "xyzk";
    if(adminToken != "xyz"){
        res.send("Unauthorized Person");
    }
    next();
}
module.exports = {adminAuth};
