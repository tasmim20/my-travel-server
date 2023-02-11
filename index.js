const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.izqajim.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{

        const database = client.db('travelBlog');
        const blogCollection = database.collection('blogs');
        const userCollection = database.collection('users');
        //   const blogCollection = client.db('travelBlog').collection('blogs');

        //blog api
        app.get('/blogs', async (req, res)=>{
            const result = await blogCollection.find({}).toArray();
            if(result.length){
                res.send({result, success: true})
            }
            else{
                res.send({success: false, message: 'Something went wrong'})
            }
        })

        //USERS API
        app.get('/users/get', async (req, res)=>{
            const result = await userCollection.find({}).toArray();
            if(result.length){
                res.send({result, success: true})
            }
            else{
                res.send({success: false, message: 'Something went wrong'})
            }
        })

        //admin get api
        app.get('/admin/:email', async (req, res)=>{
            const email = req.params.email;
            const filter = {email: email}
            const result = await userCollection.findOne(filter);
            if(result.role === 'admin'){
                res.send({ admin: true})
            }
            else{
                res.send({admin: false, message: 'Something went wrong'})
            }
        })

        //get api with specific email address
        app.get('/blogs/:email', async (req, res)=>{
            const email = req.params.email;
            const filter = {authorEmail: email};
            const result = await blogCollection.find(filter).toArray();
            if(result.length){
                res.send({result, success: true})
            }
            else{
                res.send({success: false, message: 'Something went wrong'})
            }

        })



         //all post api
          app.post('/blogs', async (req, res)=>{
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
            // res.send(result);
            if (result.insertedId) {
                res.send({ result, success: true })
            }
            else {
                res.send({ success: false, message: 'Something went wrong' })
            }
            
          })
          app.post('/users/create', async (req, res)=>{
            const blog = req.body;
            const result = await userCollection.insertOne(blog);
            // res.send(result);
            if (result.insertedId) {
                res.send({ result, success: true })
            }
            else {
                res.send({ success: false, message: 'Something went wrong' })
            }
            
          })
          

          



          //updata api
          app.put('/blogs/:id', async(req, res) =>{
            const id = req.params.id;
            const data = req.body;
            const filter = {_id:new ObjectId(id)};
            const updateDoc = {
                       $set: data
            }
            const result = await blogCollection.updateOne(filter, updateDoc);
            if (result.acknowledged) {
               res.send({ result, success: true })
           }
           else {
               res.send({ success: false, message: 'Something went wrong' })
           }

       })
            
        // delete api
        app.delete('/blogs/:id', async(req, res) =>{
             const id = req.params.id;
             const filter = {_id:new ObjectId(id)};
             const result = await blogCollection.deleteOne(filter);
             if (result.acknowledged) {
                res.send({ result, success: true })
            }
            else {
                res.send({ success: false, message: 'Something went wrong' })
            }

        })       
        
        // app.delete('/blogs/:id', async(req, res)=>{
        //     const id = req.params.id;
        //     const filter = {_id: new ObjectId(id)};
        //     const result = await blogCollection.deleteOne(filter);
        //     if(result.acknowledged){
        //         res.send({result, success: true})
        //     }
        //     else{
        //         res.send({success: false, message:'Something went wrong'})
        //     }
        // })


    }
    finally{

    }
}
run().catch(error => console.log(error))



app.get('/', (req, res)=>{
    res.send('travel server is running');
})
  


app.listen(port, ()=>{
    console.log(`travel server running on port ${port}`);
})