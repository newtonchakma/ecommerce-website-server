const express = require('express')
var cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.m66q2bv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const productCollection = client.db("E-commerce").collection("products");

        // get all products api
        app.get('/products',async(req,res)=>{
            const query = {}
            const cursor = productCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        // get single product api
        app.get('/product/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.send(result)
        })
        
        //create a post api
        app.post('/product', async(req,res)=>{
            const data = req.body;
            const result = await productCollection.insertOne(data);
            res.send(result)
        })

        // create update api
        app.put('/product/:id', async(req,res)=>{
            const id = req.params.id;
            const data = req.body;
            const filter ={_id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  ...data
                },
              };
          const result = await productCollection.updateOne(filter, updateDoc, options);
           res.send(result)
        })

    }
    finally{

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})