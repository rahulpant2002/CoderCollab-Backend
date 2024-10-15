
const validateSignUpData = (req)=>{
    const {lastName, password} = req.body;
    if(!lastName) throw new Error("Lastname is empty");
    if(password.length < 6) throw new Error("Password Length should be atleast 6!!!")
}

const validateProfileEditData = (req)=>{
    const allowedEditFields = ['firstName', 'lastName', 'emailId', 'age', 'gender', 'photoUrl', 'about', 'skills'];

    const isOK = Object.keys(req.body).every(k=>{
        return allowedEditFields.includes(k);
    })
    return isOK;
}

const validateUpdatePasswordData = (req)=>{
    const allowedFields = ['existingPassword', 'updatedPassword'];

    const isOK = Object.keys(req.body).every(k => allowedFields.includes(k));
    if (!isOK) return false;

    if(req.body.updatedPassword.length < 6) throw new Error("Updated Password Length should be atleast 6!!!");
    return true;
}

module.exports = {validateSignUpData, validateProfileEditData, validateUpdatePasswordData};
