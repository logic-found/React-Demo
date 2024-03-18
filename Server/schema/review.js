const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    author_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["accepted", "rejected", "pending"],
        required: true,
    },
    product: {
        type: {
            id: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
            name: {
                type: {
                    value: {
                        type: String,
                    },
                    edited: {
                        type: Boolean,
                    },
                },
                required: true,
            },
            description: {
                type: {
                    value: {
                        type: String,
                    },
                    edited: {
                        type: Boolean,
                    },
                },
                required: true,
            },
            price: {
                type: {
                    value: {
                        type: String,
                    },
                    edited: {
                        type: Boolean,
                    },
                },
                required: true,
            },
            images: {
                type: {
                    value: {
                        type: [String],
                    },
                    edited: {
                        type: Boolean,
                    },
                },
            },
        },
    },
});

exports.Review = mongoose.model("Review", schema);
