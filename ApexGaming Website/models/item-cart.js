const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    Name : {type:String, required: [true, 'Name is required']},
    AddedBy: {type:Schema.Types.ObjectId, ref: 'user'}
});

//model creation to access documents in corresponding collection
// item--modelname which implies items--collection name
//this mongoose obj automatically connected to mongodb

const cartItem = mongoose.model('cart', cartSchema);

module.exports = cartItem;




