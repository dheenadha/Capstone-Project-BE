const express = require("express");
const cors = require("cors")
const app = express();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const URL ="mongodb+srv://dheena:dheena@cluster0.exzcn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.use(cors());
app.use(express.json())
let users=[]


app.post("/register", async (req, res) => {
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
    // 1.Connect to Database Server
    const connection = await MongoClient.connect(URL);

    // 2.Select the database
    const db = connection.db("tour");

    // 3.Select the collection
    const collection = db.collection("register");
    const user = await collection.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Incorrect Username/Password",
      });
    }

    if (user.attempt && user.attempt == 3) {
      return res.status(401).json({
        message: "attempt execedded",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordCorrect) {
      await collection.findOneAndUpdate(
        { email: req.body.email },
        {
          $inc: {
            attempt: 1,
          },
        }
      );
      return res.status(401).json({
        message: "Incorrect Username/Password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
 
app.listen(3000, () => {
    console.log("Webserver is running in port 3000");
  });