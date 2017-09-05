const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    description: { type: String, required: true, unique: true },
    cost: { type: INTEGER, required: true },
    quantity: {type: INTEGER, required: true },

})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
