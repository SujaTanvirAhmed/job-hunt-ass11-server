require("dotenv").config();
const cors = require('cors');
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.srmjs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//     const usersCollection = client.db().collection("users");
//     // perform actions on the collection object
//     console.log("Mongodb connected");
//     client.close();
// });

run().catch(console.dir);

async function run() {
    try {
        await client.connect();
        console.log("Mongodb connected");
        const usersCollection = client.db().collection("users");
        // const servicesCollection = client.db().collection("services");

        app.get("/", async (req, res) => {
            try {
                res.send("Server running...");
            }
            catch {
                res.send("Server failed!");
            }
        });

        app.get("/users", async (req, res) => {
            try {
                const cursor = await usersCollection.find({});
                if ((await cursor.countDocuments()) === 0) {
                    res.send("No user found!");
                }
                res.json(await cursor.toArray());
                // res.send("Yes, getting users for you");
            }
            catch {
                res.send("Error getting users!");
            }
        });
    }
    catch {
        console.log("Error in run function");
    }
};

app.listen(port, () => {
    console.log(`job hunt 11 Server is Running at http://localhost:${port}`);
});