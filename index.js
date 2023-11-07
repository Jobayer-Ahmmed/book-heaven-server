import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import  { MongoClient, ServerApiVersion } from "mongodb"
import "dotenv/config"

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
  origin:["http://localhost:5173, https://library-d28b1.web.app"],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kedhyrh.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    const libraryDB = client.db("libraryDB")
    const booksCollection = libraryDB.collection("booksCollection")
    const categoryCollection = libraryDB.collection("categoryCollection")
    const userCollection = libraryDB.collection("userCollection")
    const employeeCollection = libraryDB.collection("employeeCollection")
    const borrowCollection = libraryDB.collection("borrowCollection")


    app.get("/", (req, res)=>{
      res.send("i am from backend")
    })
    app.get("/user", async(req, res)=>{
      const query = {}
      const options = {
        projection : {_id:0, email:1}
      }
      const cursor = userCollection.find(query,options)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/books", async(req, res)=>{
      console.log("i am books")
      const cursor = booksCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/books/:category", async(req, res)=>{
      const getCategory = req.params.category
      const query = {category:getCategory}
      const cursor = booksCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/details/:name", async(req, res)=>{
      const getName = req.params.name
      const query = {name : getName}
      const result = await booksCollection.findOne(query)
      res.send(result)
    })
    app.get("/category", async(req, res)=>{
      const cursor = categoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/employee", async(req, res)=>{
      const cursor = employeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/borrow/:email", async(req, res)=>{
      const getEmail = req.params.email
      const query = {email:getEmail}
      const cursor = borrowCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })


    app.post("/user", async(req, res)=>{
      const newUser = req.body
      console.log(newUser)
      const result = await userCollection.insertOne(newUser)
      res.send(result)
    })
    app.post("/borrow", async(req, res)=>{
      const newBorrow = req.body
      const result = await borrowCollection.insertOne(newBorrow)
      res.send(result)
    })
    app.post("/books", async(req, res)=>{
      const newBook = req.body
      const result = await booksCollection.insertOne(newBook)
      res.send(result)
    })


  } 
  catch(err){
    console.log(err)
  }
}
run().catch(console.dir);


app.listen(port, ()=>console.log(`the port ${port} is running`))
