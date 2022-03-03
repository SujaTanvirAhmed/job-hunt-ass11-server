const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    name: String,
    title: String,
    desc: String
});

module.exports = mongoose.model("Review", reviewSchema);