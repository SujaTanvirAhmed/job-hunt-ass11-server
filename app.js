require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");

// Express Server
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Mongodb starts
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // Dummy data
        const usersData = [
            { id: 1001, name: "Suja", prof: "Web Developer" },
            { id: 1002, name: "Zisad", prof: "Journalist" },
            { id: 1003, name: "Akash", prof: "Front-Desk Executive" }
        ];
        await client.connect();
        console.log("Mongodb connected!");

        const database = client.db(process.env.DB_NAME);
        const users = database.collection('users');

        app.get("/", (req, res) => {
            res.send("job-hunt-ass11-server is running...");
        });

        app.get("/users", (req, res) => {
            res.json(usersData);
        });

        app.post("/users", (req, res) => {
            const user = req.body;
            const id = Math.floor(Math.random() * 1000);
            const userWithId = { id, ...user };
            console.log(userWithId);
            res.json(userWithId);
        });

        app.get("/books", (req, res) => {
            res.status(200).end("Books are not available now!");
        });

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
// Mongodb ends

// Run the Express Server
app.listen(port, () => {
    console.log(`job-hunt-ass11-server is running on port ${port}.`);
});