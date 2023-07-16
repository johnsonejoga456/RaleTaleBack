const dotenv = require("dotenv");
dotenv.config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mySql = require("mysql2");
const { json } = require("body-parser");
const cookieParser = require("cookie-parser")
// const { createProxyMiddleware } = require('http-proxy-middleware');
const session = require("express-session");
// const nodemailer = require('nodemailer');

const db = mySql.createPool({
    user: process.env.USERT,
    host: process.env.DB_HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})


app.use(express.json());

app.use(cors({
    origin: [process.env.LOCAL_CLIENT_APP, process.env.REMOTE_CLIENT_APP],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));



app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
    key: "userIProps",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 1000 * 3,
    }
}))


app.get("/api/getUsers", (req, res) => {
    const sqlSelect = "SELECT * FROM users";
    db.query(sqlSelect, (error, result) => {
        res.send(result);
    })
})

// const transporter = nodemailer.createTransport({
//     host: 'smtp.elasticemail.com',
//   port: 2525,
//   secure: false,
//   auth: {
//     user: 'olatunbossemma17@gmail.com',
//     pass: 'AB94C0DE18FDF38D87FEE95E7AF8920F6018',
//   },
  
//   });


//   app.post('/send-email', (req, res) => {
//     const { to, subject, text } = req.body;
  
//     const mailOptions = {
//       from: 'olatunbossemma17@gmail.com',
//       to,
//       subject,
//       text,
//     };
  
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Error sending email');
//       } else {
//         console.log('Email sent:', info.response);
//         res.status(200).send('Email sent');
//       }
//     });
//   });




// Register Post
app.post("/api/registerPost", (req, res) => {
    const { fullname, email, phone, location, pwd } = req.body;
    const sqlSelect = "SELECT * FROM users WHERE Email  = ?";
    const sqlInsert = "INSERT INTO users(fullname,Email,Telephone,Address,Password) value(?,?,?,?,?)";
    db.query(sqlSelect, [email], (error, result) => {
        if (error) {
            console.log("error From Database");
        } else {
            if (result.length) {
                res.status(200).json({ status: 200, message: "User Already exist" })
            } else {
                res.status(404).json({ status: 404, message: "Success" })
                // db.query(sqlInsert, [fullname, email, phone, location, pwd], (error, result) => {
                //     if (error) {
                //         console.log(error);
                //     }
                // })
            }
        }
    })

})

app.post("/api/verifyUserPost", (req, res) => {
    const { Name, Email, Phone, Address, Password } = req.body;
    console.log(req.body);
    const sqlSelect = "SELECT * FROM users WHERE Email  = ?";
    const sqlInsert = "INSERT INTO users(fullname,Email,Telephone,Address,Password) value(?,?,?,?,?)";
    db.query(sqlSelect, [Email], (error, result) => {
        if (error) {
            console.log("error From Database");
        } else {
            // if (result.length) {
            //     res.status(200).json({ status: 200, message: "User Already exist" })
            // } else {
                res.status(404).json({ status: 404, message: "User Registered" })
                db.query(sqlInsert, [Name, Email, Phone, Address, Password], (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                })
            // }
        }
    })

})

// Agent Register Post
app.post("/api/agentRegister",(req,res)=>{
    const {agentFullName,agentEmail,agentPhone,agentWhatsAppPhone,agentState,agentLGA,agentTown,agentLandMark,agentStreetAddress,agentAltAddressPerson1,agentAltAddressPerson2} = req.body;
    const sqlInsert = "INSERT INTO agentUsers(agentName,agentEmail,agentPhone,agentWhatsAppPhone,agentState,agentLGA,agentTown,agentLandMark,agentStreetAddress,agentAltAddressPerson1,agentAltAddressPerson2) value(?,?,?,?,?,?,?,?,?,?,?)";
    const sqlSelect = "SELECT * FROM agentUsers WHERE agentEmail  = ?"
    db.query(sqlSelect,[agentEmail],(error,result)=>{
        if (error){
            console.log("error From databse");
        }else{
            if (result.length) {
                res.status(200).json({staus:200,message:"Agent Already Exist"})
            }else{
                db.query(sqlInsert,[agentFullName,agentEmail,agentPhone,agentWhatsAppPhone,agentState,agentLGA,agentTown,agentLandMark,agentStreetAddress,agentAltAddressPerson1,agentAltAddressPerson2],(error,result)=>{
                    if (error) {
                        console.log(error);
                    }else{
                        res.status(404).json({status:404,message:"Agent created Successfully"})
                    }
                })
                console.log(agentFullName);
            }

        }
    })
    
    // console.log(req);
})

// Session storing get
app.get("/api/loginPost", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user, userProperty: req.session.userd })
    } else {
        res.send({ loggedIn: false, })
    }
})


// Login Post
app.post("/api/loginPost", (req, res) => {

    const { email, pwd } = req.body;
    const sqlSelect = "SELECT * FROM users WHERE Email = ? AND Password = ?";
    db.query(sqlSelect, [email, pwd], (error, result) => {
        if (error) {
            console.log("error from database", error);
        } else {
            if (result.length > 0) {
                req.session.user = result
                const fullUserName = result[0].fullname;
                const sqlSelect = "SELECT * FROM props WHERE Email = ?";
                db.query(sqlSelect, [email], (error, result) => {
                    // console.log(result);
                    req.session.userd = result;
                    res.status(200).json({ status: 200, message: "User exist", fullName: fullUserName, Email: result })
                })


            } else {
                res.status(404).json({ status: 404, message: "Wrong Email or Password" })
            }
        }
    })
})


// Logout the user
app.post("/api/logout",(req,res)=>{
    const p = req.body.code;
    // console.log(p);
    if (p === 1) {
      req.session.destroy();
    }
})

// Upload Property
app.post("/api/uploadProperty",(req,res)=>{
    const {sessionEmail, availableFor, propertyPurpose, propertyType, noOfBedroom, suites, story, landType, landTypeInput, noOfFuelPumps, warehouseInput, hotelBlahBlah, state, LGA, nearestBusStop, streetName, buildingNumber, price,inspection, timeFrom, timeTo, checkboxValues,gardenAllowedRadioBtn} = req.body;
    const petArrays = JSON.stringify(checkboxValues)
    console.log(gardenAllowedRadioBtn);
    const sqlSelect =  "SELECT * FROM props WHERE AvailableFor = ? AND property_purpose = ? AND property_type = ?";

    const sqlInsert = "INSERT INTO props (Email,AvailableFor,property_purpose,property_type,no_of_bedroom,no_of_suites,no_of_story,land_type,no_of_plotAcresHectres,no_of_fuelPumps,no_of_warehouse_in_square_meter,no_of_hotelrooms,state,LGA,nearestBusStop,streetName,buildingNumber,price,PetsArray,GardenAllowed,inspection,timeFrom,timeTo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

    db.query(sqlSelect,[availableFor,propertyPurpose,propertyType,noOfBedroom,suites],(error,result)=>{
        if (error) {
            console.log("Database", error);
        }else{
            if (result.length > 0) {
                console.log("Property Found");
                res.status(200).json({status:200,message:"Property Already Submited"})
            } else {
                console.log("Property not Found But submitted");
                res.status(404).json({status:404,message:"Your property has been submmited successfully"})
                db.query(sqlInsert,[sessionEmail,availableFor,propertyPurpose,propertyType,noOfBedroom,suites,story,landType,landTypeInput, noOfFuelPumps, warehouseInput, hotelBlahBlah,state,LGA,nearestBusStop,streetName,buildingNumber,price,petArrays,gardenAllowedRadioBtn,inspection,timeFrom,timeTo],(error,result)=>{
                    console.log(error);
                })
            }
        }
    }) 
})

// Requesting For property

app.post("/api/searchingForProperty",(req,res)=>{
    const { availableFor, propertyPurpose, propertyType, noOfBedroom, suites, story, landType, landTypeInput, noOfFuelPumps, warehouseInput, hotelBlahBlah, state, LGA, nearestBusStop, budgetFrom, budgetTo, inspection, timeFrom, timeTo, searchNameContactInfo,searchPhoneCallContactInfo,searchWahtsappLineContactInfo,searchValidEmailContactInfo,searchContactInfoDropdown} = req.body;
    
    // console.log(req.body);
    const sqlInsert = "INSERT INTO searchedProps (AvailableFor,property_purpose,property_type,no_of_bedroom,no_of_suites,no_of_story,land_type,no_of_plotAcresHectres,no_of_fuelPumps,no_of_warehouse_in_square_meter,no_of_hotelrooms,state,LGA,nearestBusStop,budgetFrom,budgetTo,inspection,timeFrom,timeTo,Name,PhoneCallLine,Email,WhatsappLine,HowShouldWeContactYou) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    res.status(200).json({status:200,message:"Submitted successfully, our AI is working on your request we will get back to you soon"})
    db.query(sqlInsert,[availableFor, propertyPurpose, propertyType, noOfBedroom, suites, story, landType, landTypeInput, noOfFuelPumps, warehouseInput, hotelBlahBlah, state, LGA, nearestBusStop, budgetFrom, budgetTo, inspection, timeFrom, timeTo, searchNameContactInfo,searchPhoneCallContactInfo,searchWahtsappLineContactInfo,searchValidEmailContactInfo,searchContactInfoDropdown],(error,result)=>{
        console.log("Database", error);
    })
})



// app.get("/", (req, res) => {
//     res.send("Fuck Node")
// })

app.listen(3002, () => {
    console.log("Server up running on port 3002");
})