const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    Name: {type: String, required: [true, 'Name is required']},
    Category: {type: String, required: [true, 'Category is required']},
    Details: {type: String, required: [false, 'Details are required'], 
              minLength: [10, 'The detail should have at least 10 characters']},
    Year: {type: String, required: [true, 'Year is required']},
    CreatedBy: {type:Schema.Types.ObjectId, ref: 'user'},
  Status: { type: String },
  offerName: { type: String },
  Offered: { type: Boolean },
  Saved:{type:Boolean}
},
);

const Item = mongoose.model('Trades', tradeSchema);

module.exports = Item;

