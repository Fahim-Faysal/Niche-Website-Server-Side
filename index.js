const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yeroo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
      try {
            await client.connect();

            const databse = client.db('bike_shop');
            const bikeCollection = databse.collection('bike')
            const bikeOrderCollection = databse.collection('orders')
            const usersCollection = databse.collection('users')
            const reviewCollection = databse.collection('review')

            app.get('/bikes', async (req, res) => {

                  const cursor = await bikeCollection.find({})
                  const result = await cursor.toArray()

                  res.send(result)

            })

            app.post('/bikes', async (req, res) => {
                  const bike = req.body;

                  const result = await bikeCollection.insertOne(bike)

                  res.json(result)

            })

            app.get('/purchase/:id', async (req, res) => {
                  const id = req.params.id
                  console.log(id);
                  const query = { _id: ObjectId(id) }
                  const result = await bikeCollection.findOne(query)

                  res.json(result)


            })

            app.post('/orders', async (req, res) => {
                  const order = req.body;
                  const result = await bikeOrderCollection.insertOne(order)
                  res.json(result)

            })

            app.get('/orders', async (req, res) => {
                  const cursor = await bikeOrderCollection.find({})
                  const result = await cursor.toArray()
                  res.json(result)
            })

            //deleter an order

            app.delete('/orders/:id', async (req, res) => {
                  const id = req.params.id
                  const query = { _id: ObjectId(id) }
                  const result = await bikeOrderCollection.deleteOne(query)
                  console.log(result);
                  res.json(result)
            })

            app.get('/myorders', async (req, res) => {
                  const email = req.query.email
                  const query = { email: email }
                  const cursor = bikeOrderCollection.find(query)
                  const result = await cursor.toArray();
                  res.json(result)

            })

            app.post('/users', async (req, res) => {
                  const user = req.body
                  const result = await usersCollection.insertOne(user);

                  res.json(result)
            })

            app.get('/user/:email', async (req, res) => {
                  const email = req.params.email;
                  const query = { email: email }
                  const user = await usersCollection.findOne(query)
                  let isAdmin = false
                  if (user?.role === 'admin') {
                        isAdmin = true
                  }
                  res.json({ admin: isAdmin })
            })

            app.put('/users/admin', async (req, res) => {
                  const user = req.body;
                  console.log(user);
                  const filter = { email: user.email };
                  const updateDoc = { $set: { role: 'admin' } };
                  const result = await usersCollection.updateOne(filter, updateDoc)
                  res.json(result)
            })

            //review posts

            app.post('/review', async (req, res) => {
                  const user = req.body
                  const result = await reviewCollection.insertOne(user);

                  res.json(result)
            })

            //load review

            app.get('/review', async (req, res) => {
                  const cursor = reviewCollection.find({})
                  const result = await cursor.toArray()
                  res.json(result)
            })
      }
      finally {
            // await client.close()
      }
}
run().catch(console.dir)



app.get('/', async (req, res) => {
      res.send('Hello world')
})

app.listen(port, () => {
      console.log('port is running at :', port);
})