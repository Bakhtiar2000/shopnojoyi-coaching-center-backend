const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');;
require('dotenv').config()
const app=express();
const port= process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

//Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pyuhwjw.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const lecturesCollection = client.db('shopnojoyiDb').collection('lectures')
    const teachersCollection = client.db('shopnojoyiDb').collection('teachers')
    const programsCollection = client.db('shopnojoyiDb').collection('programs')
    const galleryCollection = client.db('shopnojoyiDb').collection('gallery')
    const reviewsCollection = client.db('shopnojoyiDb').collection('reviews')

    // lectures
    app.get('/lectures', async (req, res) => {
        const result = await lecturesCollection.find().toArray()
        res.send(result)
    })

    app.delete('/lectures/:id', async (req, res) => {
        const id = req.params.id;
        // console.log(id)
        const query = { _id: new ObjectId(id) }
        const result = await lecturesCollection.deleteOne(query)
        res.send(result)
    })


    // teachers
    app.get('/teachers', async (req, res) => {
        const result = await teachersCollection.find().toArray()
        res.send(result)
    })

    app.delete('/teachers/:id', async (req, res) => {
        const id = req.params.id;
        // console.log(id)
        const query = { _id: new ObjectId(id) }
        const result = await teachersCollection.deleteOne(query)
        res.send(result)
    })


    // gallery
    app.get('/gallery', async (req, res) => {
        const result = await galleryCollection.find().toArray()
        res.send(result)
    })

    app.delete('/gallery/:id', async (req, res) => {
        const id = req.params.id;
        // console.log(id)
        const query = { _id: new ObjectId(id) }
        const result = await galleryCollection.deleteOne(query)
        res.send(result)
    })


    // programs
    app.get('/programs', async (req, res) => {
        const result = await programsCollection.find().toArray()
        res.send(result)
    })

    app.delete('/programs/:id', async (req, res) => {
        const id = req.params.id;
        // console.log(id)
        const query = { _id: new ObjectId(id) }
        const result = await programsCollection.deleteOne(query)
        res.send(result)
    })


    // reviews
    app.get('/reviews', async (req, res) => {
        const result = await reviewsCollection.find().toArray()
        res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {}
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send('Shopnojoyi is teaching')
})

app.listen(port, ()=> {
    console.log(`Shopnojoyi server is running on port: ${port}`)
})