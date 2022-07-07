const Item = require('../models/item');
const toff = require('../models/tradeoffer')


//check if user is guest
exports.isGuest = (req,res,next)=>{
    if(!req.session.user){
         return next();
         }else{
             req.flash('error', 'You are logged in already');
             return res.redirect('/nav/profile');
         }
}



//check if user is authenticated
exports.authenticated = (req,res,next)=>{
    if(req.session.user){
        return next();
    }else{
        req.flash('error', 'You need to login first!');
        res.redirect('/nav/login');
    }
};



//checks if the item is created by user or not
exports.isCreatedBy = (req,res,next)=>{
    id = req.params.id;
    Item.findById(id)
    .then((item)=>{ 
        if(item){
            if(item.CreatedBy==req.session.user){
                console.log("Owner and user are same");
                return next();
            }else{
                let err= new Error ("you are not authorised to perform action");
                err.status =401;
                next(err);
            }
        }
    })
    .catch(err=>{
        next(err);
    })
};

exports.isHost=(req,res,next)=>{
    let id=req.params.id;
    Item.findById(id)
    .then(item=>{
        if(item){
            if(item.host==req.session.user)
                return next();
            else{
                let err=new Error('Unauthorized to access the resource');
                err.status=401;
                return next(err);
            }
        }else{
            let err = new Error('Cannot find the trade with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.isNotHost=(req,res,next)=>{
    let id=req.params.id;
    Item.findById(id)
    .then(item=>{
        if(item){
            if(item.host==req.session.user){
                let err=new Error('You cannot trade your own item');
                err.status=401;
                return next(err);
            }
            else{
                return next();
            }
        }else{
            let err = new Error('Cannot find the event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};


exports.isCreatedBy = (req, res, next) => {
    id = req.params.id;
    Item.findById(id)
      .then((item) => {
        if (item) {
          if (item.CreatedBy == req.session.user) {
            console.log("Owner is same as user");
            return next();
          } else {
            let err = new Error("you are not authorised to perform action");
            err.status = 401;
            next(err);
          }
        } else {
          let error = new Error("No Item found with id  " + id);
          error.status = 404;
          next(error);
        }
      })
      .catch((err) => {
        next(err);
      });
  };