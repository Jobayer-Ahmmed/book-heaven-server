import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import  { MongoClient, ObjectId, ServerApiVersion } from "mongodb"
import "dotenv/config"
import jwt from "jsonwebtoken"

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(cookieParser())


// {
//   origin:["http://localhost:5173, https://library-d28b1.web.app"],
//   credentials: true
// }


const verifyToken = async(req, res, next)=>{
  const myToken = req.cookies?.token
  if(!myToken){
    return res.status(401).send({message:"unauthosize"})
  }
  jwt.verify(myToken, process.env.ACCESS_TOKEN_KEY, (err, decoded)=>{
    if(err){
      return res.status(401).send({message:"unauthosize"})
    }
    req.decoded = decoded
    next()
  })
}

// if(req.query?.email !== req.myDecoded.email){
//   return res.status(403).send({message: "Forbidden Access"})
// }
// const query = {}
// if(req.query?.email){
//   query = {email : req.query.email}
// }


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kedhyrh.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);
const dbConnect = async () => {
  try {
      client.connect()
      console.log('DB Connected Successfully✅')
  } catch (error) {
      console.log(error.name, error.message)
  }
}
dbConnect()

    const libraryDB = client.db("libraryDB")
    const booksCollection = libraryDB.collection("booksCollection")
    const categoryCollection = libraryDB.collection("categoryCollection")
    const userCollection = libraryDB.collection("userCollection")
    const employeeCollection = libraryDB.collection("employeeCollection")
    const borrowCollection = libraryDB.collection("borrowCollection")

// token
    app.post("/jwt",  async(req, res)=>{
      const newUser = req.body
      console.log(newUser)
      console.log(req.myDecoded)
      const token = jwt.sign(newUser, process.env.ACCESS_TOKEN_KEY,{expiresIn:"1d"})
      res
      .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      })
      .send({
          status: true,
      })
    })



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

      const cursor = booksCollection.find()
      const result = await cursor.toArray()
      res.send(result)

    })
    app.get("/librarian", async(req, res)=>{

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
    app.get("/edit/:id", async(req, res)=>{
      let getId = req.params.id
      getId = new ObjectId(getId)
      const query = {_id:getId}
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
    }),
    app.get("/borrowBook/:email", async(req, res)=>{
      const getEmail = req.params.email
      const query = {email:getEmail}
      const options = {
        projection : {_id:0, name:1}
        
      }
      const cursor = borrowCollection.find(query,options)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/read/:id", async(req, res)=>{
      let getId = req.params.id
      getId = new ObjectId(getId)
      const query = {_id:getId}
      const options = {
        projection : {_id:0, read:1}
      }
      const result = await booksCollection.findOne(query)
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

    app.put("/books/:id", async(req, res)=>{
      let getId = req.params.id
      getId = new ObjectId(getId)
      const data = req.body
      const query = {_id:getId}

      const editData = {
        $set:{
          quantity: data.myQuantity
        }
      }
      const result = await booksCollection.updateOne(query, editData)
      res.send(result)
    })
    app.put("/book/:id", async(req, res)=>{
      let getId = req.params.id
      getId = new ObjectId(getId)
      const data = req.body
      const query = {_id:getId}

      const editData = {
        $set:{
          image:data.image,
          name:data.name,
          quantity:data.quantity,
          author_name:data.author_name,
          category:data.category,
          description:data.description,
          rating:data.rating,
          read:data.read
        }
      }
      const result = await booksCollection.updateOne(query, editData)
      res.send(result)
    })

    app.delete("/borrow/:id", async(req, res)=>{
      let getId = req.params.id
      getId =  new ObjectId(getId)
      const query = {_id:getId}
      const result = await borrowCollection.deleteOne(query)
      res.send(result)
    })
    app.delete("/delete/:id", async(req, res)=>{
      let getId = req.params.id
      getId =  new ObjectId(getId)
      const query = {_id:getId}
      const result = await booksCollection.deleteOne(query)
      res.send(result)
    })


 


app.listen(port, ()=>console.log(`the port ${port} is running`))
