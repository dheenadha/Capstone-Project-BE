const express = require("express");
const cors = require("cors")
const app = express();
const { MongoClient, ObjectId } = require("mongodb");

const URL ="mongodb+srv://dheena:dheena@cluster0.exzcn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.use(cors({
    origin: " https://capable-palmier-4f3501.netlify.app/"
}))
app.use(express.json())
let users =[]
app.get("/user",(req,res)=>{
    res.json(users)
})

app.get("/register", async (req, res) => {
   try {
    const connection = await MongoClient.connect(URL);

    // 2. Select the Database
    const db = connection.db("tour");

    // 3. Select the collection
    const collection = db.collection("register");
    if (!req.body.username) {
        res.status(400).json({
          message: "Please create correct name",
        });
    }else{
    // 4. Do the Operation (Insert, Read, Update, Delete)
    await collection.insertOne(req.body);
    // 5. Close the connection
  await connection.close();
  res.json({
      message: "Created Sucessfully",
    }); 
    }

   } catch (error) {
    res.status(500).json({
        message: "Something went wrong",
    })
   }




})

app.post("/login", async (req, res) => {
    try {
     const connection = await MongoClient.connect(URL);
 
     // 2. Select the Database
     const db = connection.db("tour");
 
     // 3. Select the collection
     const collection = db.collection("login");
     if (!req.body.email) {
         res.status(400).json({
           message: "Please create correct email",
         });
     }else{
     // 4. Do the Operation (Insert, Read, Update, Delete)
     await collection.insertOne(req.body);
     // 5. Close the connection
   await connection.close();
   res.json({
       message: "Created Sucessfully",
     }); 
     }
 
    } catch (error) {
     res.status(500).json({
         message: "Something went wrong",
     })
    }
 
 
 
 
 })
 
app.listen(3000, () => {
    console.log("Webserver is running in port 3000");
  });