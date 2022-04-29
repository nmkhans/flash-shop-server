const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

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