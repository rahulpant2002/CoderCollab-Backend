
const validateSignUpdata = (req)=>{
    const {lastName} = req.body;
    if(!lastName) throw new Error("Lastname is empty");
}

module.exports = {validateSignUpdata};