const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylo51.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db("gymWarehouse").collection("items");
        const myItemCollection = client.db("gymWarehouse").collection("myItems");

        //Get Item
        app.get('/item', async (req, res) => {
            const query = { };
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        });

        //POST Item
        app.post('/item', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        });


        // Update Quantity
        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const delivered = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: delivered.quantity,
                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options);
            // res.send(result);
            console.log(result);

        })
        
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })

        //My Items API

        app.get('/myitem', async (req, res) =>{
            const email = req.query.email;
            const query = { email: email };
            const cursor = myItemCollection.find(query);
            const myItems = await cursor.toArray();
            res.send(myItems);
        })

        app.post('/myitem', async (req, res) => {
            const newItem = req.body;
            const result = await myItemCollection.insertOne(newItem);
            res.send(result);
        });

        app.delete('/myitem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myItemCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Server is Running')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})