const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tradeofferSchema = new Schema({
  Name: { type: String, required: [true, "ItemName is required"] },
  Category: { type: String, required: [true, "Item Category is required"] },
  OfferedBy: { type: Schema.Types.ObjectId, ref: "user" },
  Status: { type: String },
  trade: { type: Schema.Types.ObjectId, ref: "item" }
});



const offer = mongoose.model("tradeoffer", tradeofferSchema);

module.exports = offer;
