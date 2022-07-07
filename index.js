const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.up3hj.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("creativeAgency").collection("users");
        const reviewCollection = client
            .db("creativeAgency")
            .collection("reviews");
        const orderCollection = client
            .db("creativeAgency")
            .collection("orders");
        const serviceCollection = client
            .db("creativeAgency")
            .collection("services");

        app.get("/services", async (req, res) => {
            const service = await serviceCollection.find().toArray();
            res.send(service);
        });
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const result = await serviceCollection
                .find({ _id: ObjectId(id) })
                .toArray();
            res.send(result);
        });
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const result = await serviceCollection.deleteOne({
                _id: ObjectId(id),
            });
            res.send(result);
        });

        app.post("/orders", async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.send(result);
        });
        app.get("/orders", async (req, res) => {
            const orders = await orderCollection.find().toArray();
            res.send(orders);
        });
        app.get("/order", async (req, res) => {
            const userEmail = req.query.email;
            const query = { userEmail: userEmail };
            const orders = await orderCollection.find(query).toArray();
            res.send(orders);
        });
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const result = await orderCollection.deleteOne({
                _id: ObjectId(id),
            });
            res.send(result);
        });

        //USER API
        app.get("/users", async (req, res) => {
            const user = await userCollection.find().toArray();
            res.send(user);
        });
        app.put("/users/:email", async (req, res) => {
            const email = req.params.email;
            const userInformation = req.body;
            const filter = { email: email };
            const option = { upsert: true };
            const updateDoc = {
                $set: userInformation,
            };
            const result = await userCollection.updateOne(
                filter,
                updateDoc,
                option
            );

            res.send({ result });
        });
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            res.send(user);
        });

        //REVIEW API
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
    } finally {
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Creative Agency");
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
