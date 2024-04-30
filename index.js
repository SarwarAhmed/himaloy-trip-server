const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.5mrfovz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5mrfovz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const spostCollection = client.db("cspostDB").collection("cspost");

        app.post('/touristSpot', async (req, res) => {
            const spost = req.body;
            console.log(spost);
            const result = await spostCollection.insertOne(spost);
            console.log('spost added', result);
            res.send(result);
        });

        app.get('/allspots', async (req, res) => {
            const cursor = spostCollection.find({});
            const sposts = await cursor.toArray();
            res.send(sposts);
        });

        app.get('/spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const spost = await spostCollection.findOne(query);
            res.send(spost);
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Himaloy trip is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
