import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import  { MongoClient, ServerApiVersion } from "mongodb"
import "dotenv/config"

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(cookieParser())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kedhyrh.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    const libraryDB = client.db("libraryDB")
    const booksCollection = libraryDB.collection("booksCollection")


    app.get("/", (req, res)=>{
      res.send("i am from backend")
    })
    app.get("/books", async(req, res)=>{
      console.log("i am books")
      const cursor = booksCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);


app.listen(port, ()=>console.log(`the port ${port} is running`))
