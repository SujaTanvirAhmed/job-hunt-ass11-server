require('dotenv').config();
const mongoose = require('mongoose');
const User = require("./User");
const Review = require("./Review");

const mongoDbConnUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}?retryWrites=true&writeConcern=majority`;

mongoose.connect(mongoDbConnUrl, () => {
    console.log("Mongoose connected");
});

run();

async function run() {
    const user = new User({ name: "Suja Tanvir Ahmed", age: 42 });
    await user.save();
    console.log(user);
}

run2();
async function run2() {
    const review = new Review({ name: "Suja", title: "User experience", desc: "The app is very easy to use" });
    await review.save();
    console.log(review);
}
