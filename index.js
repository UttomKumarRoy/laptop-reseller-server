const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//const jwt = require('jsonwebtoken');
require('dotenv').config();
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mcmgyi9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const usersCollection = client.db('laptopReseller').collection('users');
        const productsCollection = client.db('laptopReseller').collection('products');


        app.get('/users/:email', async (req,res) =>{
            const email=req.params.email;
            const user= await usersCollection.findOne({email:email});
            res.send({userType:user.userType})
        });

        app.post('/users',  async (req, res) => {
            const user= req.body;
            const email= await usersCollection.findOne({email:user.email});
            if(email){
                res.send({response:"User already found"});
            } else{
                const result = await usersCollection.insertOne(user);
                res.send({response:"User created and User info saved in database"});
            }
           
        });

        app.get('/sellers', async (req,res) =>{
            const result= await usersCollection.find({userType:"Seller"}).toArray();
            res.send(result)
        })

        app.delete('/sellers/:id', async (req,res) =>{
            const id=req.params.id;
            const result= await usersCollection.deleteOne({_id:ObjectId(id)});
            res.send(result);
        })

        app.get('/buyers', async (req,res) =>{
            const result= await usersCollection.find({userType:"Buyer"}).toArray();
            res.send(result)
        })

        app.delete('/buyers/:id', async (req,res) =>{
            const id=req.params.id;
            const result= await usersCollection.deleteOne({_id:ObjectId(id)});
            res.send(result);
        })

        app.get('/products/:email', async (req,res) =>{
            const email=req.params.email;
            const products= await productsCollection.find({email:email}).toArray();
            res.send(products)
        });

        app.post('/products',  async (req, res) => {
            const product= req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });

        app.delete('/products/:id', async (req,res) =>{
            const id=req.params.id;
            const result= await productsCollection.deleteOne({_id:ObjectId(id)});
            res.send(result);
        })

        
    }
    finally {

    }

}

run().catch(err => console.error(err));

app.get('/', async (req, res) => {
    res.send('Laptop Reseller Server is running');
})

app.listen(port, () => console.log(`Laptop Reseller Server running on ${port}`))
