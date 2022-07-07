const express = require('express');
const model  = require('../models/item');
const cart_model = require('../models/item-cart');
const off= require('../models/fav')
const toff = require('../models/tradeoffer');
const itemmodel = require('../models/item');
//get /items: gives all items
exports.index = (req,res,next)=>{
    model.find()
    .then((items)=>{
        res.render('./item/trades',{items});
    })
    .catch((err)=>{
        next(err);
    })
    
};


//get items/new : sends a form to create a new item
exports.new = (req,res)=>{
    res.render('./item/newtrade');
};

//post /items: creates a new item
exports.create = (req,res,next)=>{
    let newItem= new model(req.body);
  newItem.CreatedBy = req.session.user;
  newItem.Status = "Available";
  newItem.offerName = "";
  newItem.Offered = false;
  newItem
    //console.log("newItem is "+newItem);
    newItem.save()
    .then((newItem)=>{
        res.redirect('/items');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
    
};

//get /items:id : gives the item with that particular id
exports.show = (req,res,next)=>{
    let id = req.params.id;
      model.findById(id).populate('CreatedBy', 'firstName lastName')
    .then((item)=>{
        if(item){
            console.log("item is : "+ item);
            console.log(" created by"+ item.CreatedBy);
            res.render('./item/trade',{item});
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


//get /items/:id/edit send a form to edit the item
exports.edit= (req,res,next)=>{
    let id = req.params.id;
       model.findById(id)
    .then((item)=>{
        if(item){
            res.render('./item/edit',{item});
        }
        else{
            let error = new Error('No story found with id  ' + id);
            error.status = 404;
            next(error);
        }
    })
    .catch((err)=>{
        next(err);
    })
    
};

//put /items/:id updates a particular item
exports.update =(req,res,next)=>{
   let item = req.body;
   let id = req.params.id;
    model.findByIdAndUpdate(id,item,{useFindAndModify:false, runValidators:true})
    .then((item)=>{
        if(item){
            res.redirect('/items/'+id);
           }else{
            let error = new Error('No Item found with id  ' + id);
            error.status = 404;
            next(error);
           }
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
   
};

//delete /items/:id : deletes a particular item of an id
exports.delete = (req,res,next)=>{
   let id = req.params.id;
   model.findByIdAndDelete(id,{useFindAndModify:false})
   .then((item)=>{
    if(item){
        res.redirect('/items');
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
};

///---------------
exports.cart = (req,res,next)=>{
    let id = req.params.id;
    console.log("id is "+id);

//res.send("id is: "+id);
model.findById(id)
.then((item)=>{
    let item_quantity = req.body.quantity;
    //console.log("quantity:"+ item_quantity);
    item.Quantity = item_quantity;
    if(item){
        let newCartItem = new cart_model({
            Name: item.Name,
            Quantity:item.Quantity
        });
        newCartItem.AddedBy = req.session.user;
        newCartItem.save()
        .then((newCartItem)=>{
            res.render('./item/cartpage',{newCartItem});
        })
        .catch(err=>{
            if(err.name === 'ValidationError'){
                err.status = 400;
            }
            next(err);
        });
        
     }else {
      let error = new Error('No Item found with id  ' + id);
      error.status = 404;
      next(error);
     } 
})
.catch(err=>{
    next(err);
});

};

exports.watch = (req, res, next) => {
    console.log("in save");
    let id = req.params.id;
    console.log("id is " + id);
    model
      .findById(id)
      .then((item) => {
        let watchitem = new off({
          Name: item.Name,
          Category: item.Category,
          Status: item.Status,
        });
        watchitem.SavedBy = req.session.user;
        watchitem
          .save()
          .then((watchitem) => {
            req.flash("success", "Item Added to Watch list");
            res.redirect("/nav/profile");
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              err.status = 400;
            }
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };


exports.watchDelete = (req, res, next) => {
    let id = req.params.id;
    console.log("delete")
    off.findByIdAndDelete(id, { useFindAndModify: false })
      .then((fav) => {
        req.flash("success");
        res.redirect("/nav/profile");
        
      })
      .catch((err) => {
        next(err);
      });
  };
  
  exports.trade= (req,res,next)=>{
    // res.send("in trade");
    console.log("in trade");
    let user = req.session.user;
    iD= req.params.id;
    model.findById(iD)
    .then(item=>{  
      let newOfferItem = new toff({
        Name: item.Name,
        Status: "Offer Pending",
        Category: item.Category,
        OfferedBy: user,
      });
      Promise.all([newOfferItem.save(), model.findByIdAndUpdate(iD, {Status: "Offer Pending"})]) 
      .then(results=>{
      const  [offer,item] = results;
       model.find({CreatedBy:user})
       .then(items=>{
         res.render('./item/offer-trade', {items});
       })
       .catch(err=>{
         next(err);
       })
      })
    })
    .catch(err=>{
      next(err);
    })
   
    .catch(err=>{
      next(err);
    })
   };
   
   exports.tradeitem = (req,res,next)=>{
     console.log("in trade item");
     let id = req.params.id;
     let user = req.session.user;
    Promise.all([model.findByIdAndUpdate(id, {Status: "Offer Pending"}),toff.findOne({OfferedBy:user}).sort({'_id':-1}) ]) 
   .then(results=>{
     const [item, Offered] = results;
       let name = Offered.Name;
       model.findByIdAndUpdate(id,{offerName:name})
       .then(item=>{
         console.log("---264--item is "+item);
         res.redirect('/nav/profile')
       })
       .catch(err=>{
         next(err);
       })    
   
    
   })
   .catch(err=>{
     next(err);
   })
   };
   
   exports.manage = (req,res,next)=>{
     console.log("in manage offer function");
     let id = req.params.id;
     let user = req.session.user;
     model.findById(id)
     .then(item=>{
       console.log("--284--item is "+ item);
       console.log("----258---offername is "+item.offerName)
       if(item.offerName===" "){
         console.log("insode if---290");
         let name = item.Name;
         model.findOne({offerName:name})
         .then(item=>{
           console.log("item is ---291---"+item);
           res.render('./item/manage', {item});
         })
         .catch(err=>{
           next(err);
         })
       
       }
       else{
         console.log("insode else---286");
         let name = item.offerName;
         toff.findOne({Name:name})
         .then(offer=>{
           res.render('./item/offermanagement', {item, offer});
         })
         .catch(err=>{
           next(err);
         })
       }
     })
     .catch(err=>{
       next(err);
     })
   };
   
   exports.accept=(req,res,next)=>{
     console.log("in accept");
     let id = req.params.id;
     model.findByIdAndUpdate(id, {Status: "Traded"})
     .then(item=>{
       let name = item.offerName;
       console.log("Name is "+name);
      Promise.all([model.findOneAndUpdate({Name:name},{Status:"Traded"}), toff.findOneAndDelete({Name:name})]) 
       .then(offer=>{
         console.log("-----327----offer is "+ offer);
         res.redirect('/nav/profile');
       })
       .catch(err=>{
         next(err);
       })
     })
     .catch(err=>{
       next(err);
     })
   };
   
   
   exports.reject=(req,res,next)=>{
     console.log("in reject");
     let id = req.params.id;
     model.findByIdAndUpdate(id, {Status: "Available", offerName: " "})
     .then(item=>{
       let name = item.offerName;
       Promise.all([model.findOneAndUpdate({Name:name},{Status:"Available"}), toff.findOneAndDelete({Name:name})]) 
       .then(offer=>{
         res.redirect('/nav/profile');
       })
       .catch(err=>{
         next(err);
       })
     })
     .catch(err=>{
       next(err);
     })
   };

   exports.offerdelete = (req, res, next) => {
    console.log("in offer delete");
    let id = req.params.id;
    toff.findById(id)
    .then(offer1=>{
        let name = offer1.Name;
  console.log("name is "+ name);
    Promise.all([model.findOneAndUpdate({offerName:name}, {Status: "Available"}),
     model.findOneAndUpdate({Name:name},{Status: "Available"}),
     toff.findByIdAndDelete(id,{useFindAndModify: false })]) 
      .then(results=>{
        const [item1, item2, item3]= results;
        console.log("1."+ item1);
        console.log("2."+ item2);
        console.log("3."+ item3);
        res.redirect('/nav/profile');
      })
      .catch(err=>{
        next(err);
      })
    })
    .catch(err=>{
      next(err);
    })
  };