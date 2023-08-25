const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://twitter_admin:glatEp5dnw22NHY3@cluster0.tbi2tfe.mongodb.net/?retryWrites=true&w=majority`;

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
    const postCollection = client.db('database').collection('posts'); //this is for posts collection
    const userCollection = client.db('database').collection('users'); //this is for users collection

    //get
    app.get('/post', async (req,res)=>{
       const post = (await postCollection.find().toArray()).reverse();
       res.send(post);
    })

    app.get('/user', async (req,res)=>{
      const user = await userCollection.find().toArray();
      res.send(user);
   })

   app.get('/loggedInUser', async(req,res)=>{
      const email = req.query.email;
      const user = await userCollection.find({email : email}).toArray();
      res.send(user)
   })

   app.get('/userPost', async(req,res)=>{
    const email = req.query.email;
    const post = (await postCollection.find({email : email}).toArray()).reverse();
    res.send(post)
 })

    //post
    app.post('/post' , async(req,res)=>{
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result)
    })

    app.post('/register' , async(req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    //update
    app.patch('/userUpdates/:email' , async(req,res)=>{
      const filter = req.params;
      const profile =req.body;
      const options = {upsert : true}
      const updateDoc = {$set : profile};
      const result = await userCollection.updateOne(filter,updateDoc,options);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(err){
    // Ensures that the client will close when you finish/error
    console.log(err)
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World from Twitter!')
})

app.listen(port, () => {
  console.log(`Twitter listening on port ${port}`)
})