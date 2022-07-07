const express = require('express');
const cart_model = require('../models/item-cart');
const user = require('../models/user');
const item = require('../models/item');
const fav = require('../models/fav');
const tradeoffer = require('../models/tradeoffer')

exports.about = (req,res)=>{
    res.render('about');
};


exports.contact = (req,res)=>{
    res.render('contact');
};

exports.login = (req,res)=>{
    console.log("login");
    res.render('./user/login');
};

exports.authenticate = (req,res,next)=>{
    console.log("authenticate function");
     //authincate user's login details
     let email = req.body.email;
     let password = req.body.password;
     console.log("email is "+  email);
     console.log("password is "+ password);
       user.findOne({email:email})
     .then((user)=>{
         if(user){
             user.comparePassword(password)
             .then((result)=>{
                 if(result){
                     req.session.user = user._id;// storing user info
                     req.flash('success', 'you have successfully logged in');
                   res.redirect('/nav/profile');  
                 }else{
                     //console.log("wrong pwd");
                     req.flash('error', 'wrong password');
                     res.redirect('/nav/login');
                 }
             })
         }else{
            // console.log('wrong email');
            req.flash('error','No account found with this Email!! Please Signup'); 
            res.redirect('/nav/login');
         }
     })
     .catch((err)=>{
         next(err);
     });
}

exports.signup = (req,res)=>{
    console.log("in signup function");
    res.render('./user/signup');
};

exports.create = (req,res,next)=>{
    console.log("in create function");
    let body = new user(req.body);
    console.log(body);
    body.save()
    .then(()=>{
        res.redirect('/nav/login');
    })
  .catch(err=>{
      if(err.name==='ValidationError'){
          req.flash('error', err.message);
          return res.redirect('/nav/signup');
      }
      if(err.code===11000){
          req.flash('error','Email has been used');
          res.redirect('/nav/signup');
      }
    next(err);
  })
}

exports.msg = (req,res)=>{
res.render('message');
};

exports.profile=(req,res,next)=>{
    console.log("in profile function");
    let id = req.session.user;
    console.log("user is "+ id);
   Promise.all([user.findById(id), item.find({CreatedBy:id}), fav.find({SavedBy:id}), tradeoffer.find({OfferedBy:id})])
    .then((results)=>{
        const [user, items, favs, tradeoffers] = results;
        res.render('./user/profile',{user, items, favs, tradeoffers});
    })
    .catch((err)=>{
        next(err);
    })
}

exports.logout = (req,res,next)=>{
    req.session.destroy(err=>{
        if(err)
        return next(err);
        else
        res.redirect('/');
    })
}

exports.cartitems = (req,res,next)=>{
    console.log("inside cartitems function");
   let id = req.session.user;
   console.log("user is "+ id);
    Promise.all([user.findById(id), cart_model.find({AddedBy:id})])
    .then((results)=>{
        const [user, items] = results;
        res.render('cart',{user, items});
    })
    .catch((err)=>{
        next(err);
    })
    
};

exports.cartitem = (req,res,next)=>{
    let id = req.params.id;
    cart_model.findById(id).populate('AddedBy', 'firstName lastName')
    .then((item)=>{
        if(item){
            res.render('./item/carttrade',{item});
         }else {
          let error = new Error('No Item found with id  ' + id);
          error.status = 404;
          next(error);
         } 
    })
    .catch((err)=>{
        next(err);
    })
  
};

exports.cartedit = (req,res,next)=>{
    let id = req.params.id;
    cart_model.findById(id)
    .then((item)=>{
        if(item){
            res.render('./item/cartedit',{item});
        }
        else{
            let error = new Error('No story found with id  ' + id);
            error.status = 404;
            next(error);
        }
    })
    .catch((err)=>{
        next(err);
    });
};

exports.cartupdate = (req,res,next)=>{
       let id = req.params.id;
       //console.log("id is "+id);
cart_model.findById(id)
.then((item)=>{
    //console.log("items is "+item);
   if(item){
    let item_quantity = req.body.quantity;
    //console.log("quantity:"+ item_quantity);
    item.Quantity = item_quantity;
    //console.log("new item is "+ item);
    cart_model.findByIdAndUpdate(id,item,{useFindAndModify:false, runValidators:true})
    .then((item)=>{
        res.redirect('/nav/cart/'+id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
     });
       
      }else{
       let error = new Error('No Item found with id  ' + id);
       error.status = 404;
       next(error);
      }
})
.catch((err)=>{
    next(err);
});
};


exports.cartdelete = (req,res,next)=>{
    let id = req.params.id;
       cart_model.findByIdAndDelete(id,{useFindAndModify:false})
    .then((item)=>{
     if(item){
         res.redirect('/nav/cart');
     }
     else{
       let error = new Error('No Item found with id  ' + id);
       error.status = 404;
       next(error);
     }
    })
    .catch(err=>{
     next(err);
 });     
}