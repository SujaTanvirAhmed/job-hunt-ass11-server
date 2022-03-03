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
const connUri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.CLUSTER_URL}?retryWrites=true&writeConcern=majority`;

const mongodbClient = new MongoClient(connUri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = mongodbClient.db(process.env.DB_NAME);
const usersCollection = database.collection('users');
const servicesCollection = database.collection('services');
const featuresCollection = database.collection('features');

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
    res.send(`Job Hunt Ass11 Server is Running ...`);
});

app.get("/features", async (req, res) => {
    try {
        const cursor = await featuresCollection.find({});
        if ((await featuresCollection.countDocuments()) === 0) {
            res.send("No documents found!");
            return;
        }
        res.json(await cursor.toArray());
    }
    catch {
        res.send("Error getting features!");
    };
});

app.get("/users", async (req, res) => {
    try {
        const cursor = await usersCollection.find({});
        if ((await usersCollection.countDocuments()) === 0) {
            res.send("No documents found!");
            return;
        }
        res.json(await cursor.toArray());
    }
    catch {
        res.send("Error getting users!");
    };
});

app.get("/services", async (req, res) => {
    try {
        const cursor = await servicesCollection.find({});
        if ((await servicesCollection.countDocuments()) === 0) {
            res.send("No documents found!");
            return;
        }
        res.json(await cursor.toArray());
    }
    catch {
        res.send("Error getting services!");
    };
});

app.get("/load-services", async (req, res) => {
    // try {
    //     const result = await servicesCollection.insertMany(services, { ordered: true });
    //     console.log(result.insertedCount, "docs uploaded");
    //     res.send(`${result.insertedCount} documents inserted!`);
    // }
    // catch {
    //     res.send("error");
    // }
});
// ==================================================
// ==================================================
app.get("/products/:productId", async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await productsCollection.findOne({ _id: ObjectId(productId) });
        if (product) {
            res.json(product);
        }
        res.json({});
    }
    catch {
        res.json({});
    }
});

app.delete("/products/:productId", async (req, res) => {
    const productId = req.params.productId;
    try {
        const result = await productsCollection.deleteOne({ _id: ObjectId(productId) });
        if (result.deletedCount === 1) {
            res.json({ reply: "SUCCESS" });
        }
        else {
            res.json({ reply: "FAILURE" });
        }
    }
    catch {
        res.json({ reply: "FAILURE" });
    }
});

app.post("/make-admin", async (req, res) => {
    const email = req.body.email;
    try {
        const result = await usersCollection.findOne({ email });
        if (result) {
            const uRes = await usersCollection.updateOne(
                { email }, { $set: { role: "admin" } }, { upsert: true }
            );
            if (uRes.modifiedCount === 1) {
                res.json({ reply: "SUCCESS" });
            } else {
                res.json({ reply: "FAILURE" });
            }
        }
        else {
            res.json({ reply: "NOTFOUND" });
        }
    }
    catch {
        res.json({ reply: "FAILURE" });
    }
});

app.post("/add-product", async (req, res) => {
    const product = req.body;
    try {
        result = await productsCollection.insertOne(product);
        if (await result.insertedId) {
            res.json({ reply: "SUCCESS" });
        }
        res.json({ reply: "FAILURE" });
    }
    catch {
        res.json({ reply: "FAILURE" });
    }
});

app.post("/users", async (req, res) => {
    const user = req.body;
    const dbUser = { name: user.name, email: user.email };
    const action = user.action;

    try {
        if (action === "LOGIN") {
            const findResult = await usersCollection.findOne({ email: dbUser.email });
            if (findResult) {
                res.json({ user_role: findResult.role });
                return;
            }
            // Not found. So, new user
            const insertResult = await usersCollection.insertOne(
                { ...dbUser, role: "user" });
            if (insertResult) {
                res.json({ user_role: "user" });
                return;
            }
        }
        else if (action === "REGISTER") {
            const result = await usersCollection.insertOne(
                { ...dbUser, role: "user" });
            if (result.insertedId) {
                res.json({ msg: "REGISTER_OK" });
                return;
            }
            res.json({ msg: "REGISTER_FAIL" });
        }
    }
    catch {
        console.dir;
        res.json({ error: "db_error" });
    }
});

app.get("/orders", async (req, res) => {
    try {
        const cursor = await ordersCollection.find({});
        if ((await cursor.count()) === 0) {
            res.json([]);
        }
        res.json(await cursor.toArray());
    }
    catch {
        res.json([]);
    }
});

app.get("/orders/:email", async (req, res) => {
    try {
        const cursor = await ordersCollection.find({ email: req.params.email });
        if ((await cursor.count()) === 0) {
            res.json([]);
        }
        res.json(await cursor.toArray());
    }
    catch {
        res.json([]);
    }
});

app.patch("/orders/ship/make/:orderId", async (req, res) => {
    try {
        const result = await ordersCollection.updateOne({ _id: ObjectId(req.params.orderId) },
            { $set: { status: "shipped" } }, { upsert: true });
        if (result.modifiedCount === 1) {
            res.send("SUCCESS");
        }
        res.send("FAILURE");
    }
    catch {
        res.send("DBERROR");
    }
});

app.post("/orders", async (req, res) => {
    const order = req.body;
    try {
        const result = await ordersCollection.insertOne(order);
        if (result) {
            // console.log("An order placed!");
            res.json({ reply: "SUCCESS" });
        }
        res.json({ reply: "FAILURE" });
    }
    catch {
        res.json({ reply: "FAILURE" });
    }
});

app.delete("/orders", async (req, res) => {
    const { orderId } = req.body;
    try {
        const result = await ordersCollection.deleteOne({ _id: ObjectId(orderId) });
        if (result.deletedCount === 1) {
            res.send("Successfully deleted an order!");
        }
        res.send("Couldn't delete the order!");
    }
    catch {
        res.send("DB Error on deleting an order!");
    }
});

app.listen(port, () => {
    console.log(`Job Hunt Ass11 Server is Running at http://localhost:${port}`);
});
