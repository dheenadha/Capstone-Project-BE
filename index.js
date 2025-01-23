const express = require("express");
const cors = require("cors")
const app = express();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken")

const URL ="mongodb+srv://dheena:dheena@cluster0.exzcn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const SECRET_KEY =
  "CKSNBMSLZFHGXdgwufgvbhawmaeo4378rtgxyuhjzbdxfxckquebivjqexiv";
app.use(cors());
app.use(express.json())
let users=[]
app.get("/register", async (req, res) => {
  try {
    // 1. Connect the Database Server
    const connection = await MongoClient.connect(URL);

    // 2. Select the Database
    const db = connection.db("tour");

    // 3. Select the collection
    const collection = db.collection("register");

    const students = await collection.find({}).toArray();

    // 5. Close the connection
    await connection.close();

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});


app.post("/register", async (req, res) => {
   try {
    const connection = await MongoClient.connect(URL);

    // 2. Select the Database
    const db = connection.db("tour");

    // 3. Select the collection
    const collection = db.collection("register");

     const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    
    // 4. Do the Operation (Insert, Read, Update, Delete)
    await collection.insertOne(req.body);
    // 5. Close the connection
  await connection.close();
  res.json({
      message: "Created Sucessfully",
    }); 
    

   } catch (error) {
    res.status(500).json({
        message: "Something went wrong",
    })
   }

})

app.post("/login", async (req, res) => {
  try {
    console.log(req.body)
    // 1.Connect to Database Server
    const connection = await MongoClient.connect(URL);

    // 2.Select the database
    const db = connection.db("tour");

    // 3.Select the collection
    const collection = db.collection("register");
   
    const user = await collection.findOne({ email: req.body.email });
    console.log(user)
    //if (!user) {
      //return res.status(404).json({
       // message: "Incorrect Username/Password",
     // });
    //}

   // if (user.attempt && user.attempt == 5) {
     // return res.status(401).json({
       // message: "attempt execedded",
     // });
    //}

//    const passwordCorrect = await bcrypt.compare(
//      req.body.password,
 //     user.password
  //  );
//console.log(passwordCorrect)
//    if (!passwordCorrect) {
//      await collection.findOneAndUpdate(
//        { email: req.body.email },
//{
 //         $inc: {
 //           attempt: 1,
 //         },
 //       }
 //     );
 //     return res.status(401).json({
  //      message: "Incorrect Username/Password",
  //    });
  //  }
 //   await connection.close();
    // Generate Token
    const token = jwt.sign({ id: user._id }, SECRET_KEY);

    return res.json({ message: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Incorrect Username/Password",
    });
  }
});
 
app.listen(3000, () => {
    console.log("Webserver is running in port 3000");
  });