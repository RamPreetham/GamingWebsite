const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName :{type: String, required: [true, 'FirstName is required']},
    lastName :{type: String, required: [true, 'LastName is required']},
    email:{type: String, required: [true, 'email is required'], unique: true},
    password: {type: String, required: [true, 'Password is required']},
});


// password is converted to hased pwd before storing DB for security purposes

UserSchema.pre('save', function(next){
    console.log("in pre save function");
    let user = this;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.hash(user.password, 10)
    .then((hash)=>{
        console.log("ih then of hash function");
        user.password = hash;
        next();
    })
    .catch((err)=>{
        next(err);
    });
});

//comparing login details
UserSchema.methods.comparePassword = function (password){
    return bcrypt.compare(password, this.password);
}
const usermodel = mongoose.model('user',UserSchema);
module.exports = usermodel;