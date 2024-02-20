const mongoose = require("mongoose");
const cors = require("cors")
const jwt = require("jsonwebtoken")
// Connecting to database
mongoose.connect("mongodb+srv://atongjonathan2:selisrare@cluster0.semmei4.mongodb.net/MCA?retryWrites=true&w=majority")// Promise
.then(()=>
{
    console.log("Connection successfull!");
})
.catch((err)=>{
    console.log(err);
})
// Before creating a collection we need a schema to specify the STRUCTURE of data  
//SCHEMA
const userSchema =  new mongoose.Schema(
    {
        f_name:
        {
            type:String,
            required:[true, "First Name is required"],
        },
        l_name:
        {
            type:String,
            required:[true, "Last Name is required"],
        },
        m_name:
        {
            type:String,
        },
        id_no:
        {
            type:Number,
            required:[true, "ID No is required"]
        },
        dob:
        {
            type: Date,
            required:[true, "Date is required"]
        },
        gender:
        {
            type: String,
            enum: ["M", "F"] // Collection of constraints
        },
        marital:
        {
            type: String,
            enum: ["single", "married"]
        },
        po_box:
        {
            type: String,
            required:[true, "Postal Address is required"]
        },
        county:
        {
            type:String,
            required:[true, "County Name is required"],
        },
        phone_no:
        {
            type:Number,
            required:[true, "Phone No is required"]
        },
        email:
        {
            type:String,
            required:[true, "Email is required"]
        },
        password:
        {
            type:String,
            required:[true, "Password is required"]
        },
    },{timestamps:true}// To also have made at and updated at 
)
// The program cannot use colectoins directly so we need a model object to represent the collection you want to connect to.
// MODEL
const userModel = mongoose.model("users", userSchema);// Specifying the collection name with the schema passing them as arguements

// Creating User


const express = require("express");
app = express();
app.use(express.json());
app.use(cors());


app.get("/test", (req,res)=>
{
    console.log("Request recieved");
    res.send({message:"Hello World"});
})

const bcrypt = require("bcryptjs");
app.post("/register", (req,res)=>
{
    let body = req.body
    bcrypt.genSalt(10, (err,salt)=>
    {
        if (!err)
        {
            bcrypt.hash(body.password, salt, (err, hpass)=>
            {
                if (!err)
                {
                    console.log(hpass);
                    body.password = hpass;
                    userModel.create(body)
                    .then((data)=>
                    {
                        console.log(data);
                        jwt.sign({email:body.email}, "MCA", (err,token)=>
                        {
                            if (!err)
                            {
                                res.send({
                                    token:token,
                                    email:body.email
                                
                                });
                            }
                        })
                    })
                    .catch((err)=>
                    {
                        console.log(err);
                        res.send("Some problem");
                    })
                }
            })
        }
    })

})
app.post("/login", (req,res)=>
{
    let userCred = req.body
    userModel.findOne({email:userCred.email})// Find the user thant matches the email
    .then((user)=>
    {
        if(user!=null)
        {
            bcrypt.compare(userCred.password, user.password, (err, result)=>
            {
                if (result==true)
                {
                    jwt.sign({email:userCred.email}, "MCA", (err,token)=>
                    {
                        if (!err)
                        {
                            res.send({
                                token:token,
                                email:userCred.email
                            
                            });
                        }
                    })
                }
                else
                {
                    console.log(err);
                    res.send({message:"Wrong password"});
                }
            })

        }
        else{
            res.send({message:"Wrong email"});
        }
    })
    .catch((err)=>
    {
        console.log(err);
        res.end({message:"Some Problem"})// If there was an issue in the query not not finding)
    })
})


app.listen(60000, ()=>
{
    console.log("Server is running")
})
