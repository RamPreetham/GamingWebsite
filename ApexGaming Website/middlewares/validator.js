//check if the route parameter is valid ObjectId type value
const {body}=require('express-validator');
const{validationResult} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    if(id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }
};

exports.validateSignup=[body('firstName','First name cannot be empty').notEmpty().trim().escape(),
body('lastName','Last name cannot be empty').notEmpty().trim().escape(),
body('email','Email must be a valid Email address').isEmail().trim().escape().normalizeEmail(),
body('password','Password must be atleast 8 characters and atmost 64 characters').trim().isLength({min:8,max:64})];

exports.validateLogin=[body('email','Email must be a valid Email address').isEmail().trim().escape().normalizeEmail(),
body('password','Password must be atleast 8 characters and atmost 64 characters').trim().isLength({min:8,max:64})];

exports.validateTrade=[body('Name','Name cannot be empty').notEmpty().trim().escape(),
body('Category','Category cannot be empty').notEmpty().trim().escape(),
body('Details','Details cannot be empty').notEmpty().trim().escape(),
body('Year','Year cannot be empty').notEmpty().trim().escape().isLength({min:4,max:4}),
body('CreatedBy','Name cannot be empty').notEmpty().trim().escape()];

exports.validateResult = (req, res, next) =>{
    let errors = validationResult(req);
    if (!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash ('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}
