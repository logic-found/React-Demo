const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    price: { type: Number, required: [true, "Please enter product price"] },
    images: {
        type: [String],
        required: [true, "Please give product image"],
    }
});

exports.Product = mongoose.model("Product", schema);
