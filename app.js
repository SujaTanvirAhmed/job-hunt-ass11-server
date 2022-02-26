require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Mongodb starts
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db(process.env.DB_NAME).collection("users");
    // perform actions on the collection object
    console.log("Connected to mongodb");
    client.close();
});
// Mongodb ends

app.get("/", (req, res) => {
    res.send("job-hunt-ass11-server is running...");
});

app.get("/users", (req, res) => {
    res.json(users);
});

app.post("/users", (req, res) => {
    const user = req.body;
    const id = Math.floor(Math.random() * 1000);
    const userWithId = { id, ...user };
    console.log(userWithId);
    res.json(userWithId);
});

app.listen(port, () => {
    console.log(`job-hunt-ass11-server is running on port ${port}.`);
});

const users = [
    { id: 1001, name: "Suja", prof: "Web Developer" },
    { id: 1002, name: "Zisad", prof: "Journalist" },
    { id: 1003, name: "Akash", prof: "Front-Desk Executive" }
];