const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//? middle were
app.use(cors());
app.use(express.json());
const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access!' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (error, decode) => {
        if (error) {
            return res.statut(403).send({ message: 'Access Forbidden!' })
        }
        req.decode = decode;
    })
    next();
}

//? Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@flash.f9fim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//? Server Stablish
const server = async () => {
    try {
        client.connect();
        const database = client.db('cars-werehouse');
        const carsCollection = database.collection('cars');

        //? get all inventory item
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = carsCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        })

        //? get user inventory Item
        app.get('/useritem', verifyUser, async (req, res) => {
            const decodedEmail = req.decode.email;
            const email = req.query.email;
            const query = { email: email };
            const cursor = carsCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        })

        //? get inventory item by id
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const car = await carsCollection.findOne(query);
            res.send(car);
        })

        //? add inventory item
        app.post('/inventory', async (req, res) => {
            const car = req.body;
            const result = await carsCollection.insertOne(car);
            res.send(result);
        });

        //? update stock of inventory item
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const quantity = req.body.quantity;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: quantity,
                }
            };
            const result = await carsCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        })

        //? delete an inventory item
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carsCollection.deleteOne(query);
            res.send(result)
        })

        //? Authentication
        app.post('/auth', async (req, res) => {
            const user = req.body;
            console.log(user)
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1d'
            })
            res.send({ token: token })
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