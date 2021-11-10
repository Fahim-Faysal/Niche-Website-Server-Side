const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
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

            app.get('/bikes', async (req, res) => {

                  const cursor = await bikeCollection.find({})
                  const result = await cursor.toArray()
                  console.log(result);
                  res.send(result)

            })

            app.post('/bikes', async (req, res) => {
                  const bike = req.body;
                  console.log(bike);
                  const result = await bikeCollection.insertOne(bike)
                  console.log(result);
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