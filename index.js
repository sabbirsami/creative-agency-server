const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

async function run() {
    try {
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
