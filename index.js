const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//? middle were
app.use(cors());
app.use(express.json());

//? Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@flash.f9fim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//? Server Stablish
const server = async () => {
    try {
        client.connect();
        const database = client.db('cars-werehouse');
        const carsCollection = database.collection('cars');

        //? get all cars
        app.get('/cars', async (req, res) => {
            const query = {};
            const cursor = carsCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        })

        //? get car by id
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const car = await carsCollection.findOne(query);
            res.send(car);
        })
    }

    finally {
        //// client.close();
    }
}

server().catch(console.dir);

//? listening to port
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log('listening to port', port);
});