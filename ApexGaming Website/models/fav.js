const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const offerSchema=new Schema({
    Name: { type: String, required: [true, "ItemName is required"] },
    Category: {type:String, required: [true, 'Item Category is required']},
    SavedBy: { type: Schema.Types.ObjectId, ref: "user" },
    Status: {type: String}
});

//Collection will be named as favs in Database
module.exports=mongoose.model('Fav',offerSchema);
