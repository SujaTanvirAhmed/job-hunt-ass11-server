const express = require('express');
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

// Initialize the app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database settings
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}?retryWrites=true&writeConcern=majority`;
console.log(uri);//test

const mongodbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = mongodbClient.db(process.env.DB_NAME);
const usersCollection = database.collection('users');
const servicesCollection = database.collection('services');

// Connecting mongodb
async function startMongo() {
    try {
        await mongodbClient.connect();
        console.log("Mongodb connection successful!")
    }
    catch {
        console.log("Mongodb connection fails!");
    }
}
startMongo();

app.get("/", (req, res) => {
    res.send(`Job Hun Ass11 Server is Running ...`);
});

app.get("/users", async (req, res) => {
    try {
        const cursor = await usersCollection.find({});
        if ((await cursor.countDocuments()) === 0) {
            const msg = { message: "No documents found!" };
            res.json(msg);
        }
        const result = await cursor.toArray();
        res.json(result);
    }
    catch {
        res.send("Error getting users...");
    };
});

app.get("/services", async (req, res) => {
    try {
        const cursor = await servicesCollection.find({});
        if ((await cursor.countDocuments()) === 0) {
            const msg = { message: "No documents found!" };
            res.json(msg);
        }
        const result = await cursor.toArray();
        res.json(result);
    }
    catch {
        res.send("Error getting services...");
    };
});

app.listen(port, () => {
    console.log(`Job Hunt Ass11 Server is Running at http://localhost:${port}`);
});
