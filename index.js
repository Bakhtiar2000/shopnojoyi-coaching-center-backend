const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

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
        const passwordCollection = client.db('shopnojoyiDb').collection('password')
        const paymentsCollection = client.db('shopnojoyiDb').collection('payments')

        // lectures
        app.get('/lectures', async (req, res) => {
            const result = await lecturesCollection.find().toArray()
            res.send(result)
        })

        app.delete('/lectures/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await lecturesCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/lectures', async (req, res) => {
            const item = req.body
            const result = await lecturesCollection.insertOne(item)
            res.send(result)
        })


        // teachers
        app.get('/teachers', async (req, res) => {
            const result = await teachersCollection.find().toArray()
            res.send(result)
        })

        app.delete('/teachers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await teachersCollection.deleteOne(query)
            res.send(result)
        })

        app.patch('/teachers/:id/:singleClass', async (req, res) => {
            const id = req.params.id;
            const singleClass = req.params.singleClass;
            const query = { _id: new ObjectId(id) }
            const update =  { $pull: { classes: singleClass } };
            const result = await teachersCollection.updateOne(query, update);
            res.send(result)
        })

        app.patch('/teachers/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateData = req.body
            const updateDoc = {
                $set: {
                    name: updateData?.name,
                    position: updateData?.position,
                    education: updateData?.education,
                    classes: updateData?.classes
                }
            };
            const result = await teachersCollection.updateOne(filter, updateDoc)
            res.send(result)
        });

        app.post('/teachers', async (req, res) => {
            const item = req.body
            const result = await teachersCollection.insertOne(item)
            res.send(result)
        })


        // gallery
        app.get('/gallery', async (req, res) => {
            const result = await galleryCollection.find().toArray()
            res.send(result)
        })

        app.delete('/gallery/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await galleryCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/gallery', async (req, res) => {
            const item = req.body
            const result = await galleryCollection.insertOne(item)
            res.send(result)
        })


        // programs
        app.get('/programs', async (req, res) => {
            const result = await programsCollection.find().toArray()
            res.send(result)
        })

        app.delete('/programs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await programsCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/programs', async (req, res) => {
            const item = req.body
            const result = await programsCollection.insertOne(item)
            res.send(result)
        })


        // reviews
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray()
            res.send(result)
        })

        // payments
        app.get('/payments', async (req, res) => {
            const result = await paymentsCollection.find().toArray()
            res.send(result)
        })

        app.delete('/payments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await paymentsCollection.deleteOne(query)
            res.send(result)
        })

        app.patch('/payments/:id/:sub', async (req, res) => {
            const id = req.params.id;
            const sub = req.params.sub;
            const query = { _id: new ObjectId(id) }
            const update =  { $pull: { subjects: sub } };
            const result = await paymentsCollection.updateOne(query, update);
            res.send(result)
        })

        app.post('/payments', async (req, res) => {
            const item = req.body
            const result = await paymentsCollection.insertOne(item)
            res.send(result)
        })

        app.patch('/payments/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateData = req.body
            const updateDoc = {
                $set: {
                    division: updateData?.division,
                    subjects: updateData?.subjects,
                    payment: updateData?.payment
                }
            };
            const result = await paymentsCollection.updateOne(filter, updateDoc)
            res.send(result)
        });

        // password
        app.get('/password', async (req, res) => {
            if (`${process.env.TOKEN}` !== req.query.token) {
                return res.status(403).send({ error: 1, message: "Forbidden access" })

            }
            const result = await passwordCollection.find().toArray()
            res.send(result)
        })

        app.patch('/password', async (req, res) => {

            if (`${process.env.TOKEN}` !== req.query.token) {
                return res.status(403).send({ error: 1, message: "Forbidden access" })

            }
            const userEmail = `${process.env.USER_MAIL}`;
            const filter = { mail: userEmail };
            const { pass } = req.body
            const updateDoc = {
                $set: {
                    pass: pass
                }
            };
            const result = await passwordCollection.updateOne(filter, updateDoc)
            res.send(result)
        });


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Shopnojoyi is teaching')
})

app.listen(port, () => {
    console.log(`Shopnojoyi server is running on port: ${port}`)
})