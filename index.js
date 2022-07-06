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

        app.post("/orders", async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.send(result);
        });
        app.get("/orders", async (req, res) => {
            const orders = await orderCollection.find().toArray();
            res.send(orders);
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
