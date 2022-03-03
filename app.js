require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");
const path = require('path');
const NodeCouchdb = require('node-couchdb');

// Express Server
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Mongodb codes
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log("Mongodb connected!");

        // Setup database and collections
        const database = client.db(process.env.DB_NAME);
        const usersCollection = database.collection('users');
        const servicesCollection = database.collection('services');

        app.get("/load-services", async (req, res) => {
            // console.log(services);
            // res.json(services);

            const options = { ordered: true };
            const result = await servicesCollection.insertMany(services, options);
            console.log(`${result.insertedCount} documents were inserted`);
            res.send(`${result.insertedCount} documents were inserted to the services collection!`);
        });

        app.get("/", (req, res) => {
            res.send("job-hunt-ass11-server is running...");
        });

        app.get("/users", async (req, res) => {
            try {
                const cursor = await usersCollection.find({});
                if ((await cursor.countDocuments()) === 0) {
                    res.send("No users found");
                }
                const users = await cursor.toArray();
                res.json(users);
            }
            catch {
                res.send("DB_ERROR: Error in loading users!");
            }
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

        app.get("/services", async (req, res) => {
            try {
                const cursor = await servicesCollection.find({});
                if ((await cursor.countDocuments()) === 0) {
                    res.send("No documents found");
                }
                const services = await cursor.toArray();
                res.json(services);
            }
            catch {
                res.send("DB_ERROR: Error in loading users!");
            }
        });

        app.get("/users-data", (req, res) => {
            res.json(usersData);
        });

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
// Mongodb ends

// Run the Express Server
app.listen(port, () => {
    console.log(`job-hunt-ass11-server is running on port ${port}.`);
});

/*----------------
Deployed to:
https://guarded-crag-35775.herokuapp.com/
----------------*/

// Dummy data
const usersData = [
    { id: 1001, name: "Suja", prof: "Web Developer" },
    { id: 1002, name: "Zisad", prof: "Journalist" },
    { id: 1003, name: "Akash", prof: "Front-Desk Executive" }
];

const services = [
    {
        title: "Amritsar Sojourn",
        imgLoc: "https://i.ibb.co/HHK6xQX/amritsar.jpg",
        cost: 43000
    },
    {
        title: "Island Hopping in Andaman",
        imgLoc: "https://i.ibb.co/7rR64H3/andaman.jpg",
        cost: 53000
    },
    {
        title: "French Touch In Pondicherry",
        imgLoc: "https://i.ibb.co/W2X15hk/pondicherry.jpg",
        cost: 37000
    },
    {
        title: "Kashmir-Paradise on Earth (With Flights)",
        imgLoc: "https://i.ibb.co/HCwRwvq/kashmir.jpg",
        cost: 65000
    },
    {
        title: "Turkish Delight",
        imgLoc: "https://i.ibb.co/vvk9Kmv/turkey.jpg",
        cost: 99000
    },
    {
        title: "Splendid Sri Lanka",
        imgLoc: "https://i.ibb.co/0Dd2pG0/srilanka.jpg",
        cost: 72000
    },
    {
        title: "Offbeat Trails of Kaziranga & Meghalaya",
        imgLoc: "https://i.ibb.co/k3Ln7Cb/meghalaya.jpg",
        cost: 74000
    },
    {
        title: "WOW Wellness @ Kerala",
        imgLoc: "https://i.ibb.co/ZLGL0r2/kerala.jpg",
        cost: 53000
    }

];