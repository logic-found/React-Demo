const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new Schema({
    email: {
        type: String,
        required: [true, "Please enter user email"],
        unique: [true, "Email already registered"],
        maxLength: 50
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
    },
    role: { type: String, default: "teamMember" },
});

schema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    else{
        this.password = await bcrypt.hash(this.password, 10);
    }
});

schema.methods.generateJWTtoken = function () {
    const options = {
        expiresIn: process.env.JWT_EXPIRE,
    };
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, options);
};

schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
exports.User = mongoose.model("User", schema);
