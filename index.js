const dotenv = require("dotenv");
dotenv.config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mySql = require("mysql2");
const { json } = require("body-parser");
const cookieParser = require("cookie-parser")
const session = require("express-session");
const CryptoJS = require("crypto-js")



const db = mySql.createPool({
    user: process.env.USERT,
    host: process.env.DB_HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})


app.use(express.json());

app.use(cors({
    origin: [process.env.LOCAL_CLIENT_APP, process.env.REMOTE_CLIENT_APP, process.env.LOCAL_AMDMIN_APP],
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
        expires: 24 * 60 * 60 * 1000,
    }
}))

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin','http://localhost:3001');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
//   });



app.get("/api/getUsers", (req, res) => {
    const sqlSelect = "SELECT * FROM users";
    db.query(sqlSelect, (error, result) => {
        res.send(result);
    })
})

app.get("/api/getAgentUsers", (req, res) => {
    const sqlSelect = "SELECT * FROM agentUsers ";
    db.query(sqlSelect, (error, result) => {
        res.send(result);
    })
})


app.post("/DropUsers", (req, res) => {
    const { email } = req.body
    const sqlDrop = "DELETE FROM users WHERE Email = ?";
    db.query(sqlDrop, [email], (error, result) => {
        if (error) {
            console.log(error);
        }
        console.log("this is result", result);
    })

})
app.post("/api/deleteProp", (req, res) => {
    const { id } = req.body;
    console.log(id);
    const sqlDelete = "DELETE FROM props WHERE id = ?";

    db.query(sqlDelete, [id], (error, result) => {
        if (error) {
            console.log(error);
        } console.log(result);
    })
    // console.log(res);
})



app.get("/api/Props", (req, res) => {
    const sqlSelect = "SELECT *, DATE_FORMAT(Date, '%Y-%m-%d %H:%i:%s') AS formatted_date FROM props";
    db.query(sqlSelect, (error, result) => {
        if (error) {
            // Handle the error, e.g., send an error response.
            console.error(error);
            res.status(500).send("Internal server error");
        } else {
            // Get the formatted_date from the result and modify the response.
            const formattedResult = result.map(item => {
                return {
                    ...item,
                    Date: item.formatted_date // Replace timestamp_column with the actual column name where the timestamp is stored.
                };
            });
            res.send(formattedResult);
        }
    });
});

app.get("/api/matchedProperties", (req, res) => {
    const sqlSelect = "SELECT * FROM searchedProps";
    const sqlSelect2 = "SELECT * FROM props";

    db.query(sqlSelect, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            db.query(sqlSelect2, (error, result2) => {
                if (error) {
                    console.log(error);
                } else {
                    // Filter data with the same field value from both result and result2
                    const matchingData = result.filter((item) =>
                        result2.some(
                            (item2) =>
                                item2.AvailableFor === item.AvailableFor &&
                                item2.property_purpose === item.property_purpose &&
                                item2.property_type === item.property_type
                        )
                    );

                    // res.send(matchingData);
                    res.send(matchingData);
                    // console.log(matchingData);
                }
            });
        }
    });
});


// Register Post
app.post("/api/registerPost", (req, res) => {
    const { fullname, email, phone, location, pwd } = req.body;
    const sqlSelect = "SELECT * FROM users WHERE Email  = ?";

    db.query(sqlSelect, [email], (error, result) => {
        if (error) {
            console.log("error From Database", error);
        } else {
            if (result.length) {
                res.status(200).json({ status: 200, message: "Email already exist" })
            } else {
                res.status(404).json({ status: 404, message: "Success", ses: req.body })
            }
        }
    })

})





app.post("/api/verifyUserPost", (req, res) => {
    const { token, encryptedObject } = req.body;
    console.log("This is the", token);
    const sqlSelect = "SELECT * FROM userVerification";
    const sqlInsert = "INSERT INTO userVerification(token,encdata) value(?,?)";
    const sqlDelete = "DELETE FROM userVerification WHERE token = ?";
    db.query(sqlInsert, [token, encryptedObject], (error, result) => {
        if (error) {

            console.log("error From Database", error);
        } else {
            db.query(sqlSelect, (error, result) => {
                if (error) {
                    console.log(error);
                } else {

                    setTimeout(() => {
                        db.query(sqlDelete, [token], (error, result) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("from the deleting", result);

                            }
                        })

                    }, 60000 * 30);

                    console.log(result)


                    res.status(200).json({ status: 200, message: result })
                }
            })
        }
    })

})
app.post("/api/verifiedUserPost", (req, res) => {
    const { Token } = req.body;
    console.log("This is the", Token);
    const sqlSelect = "SELECT * FROM userVerification WHERE token = ?";
    const sqlInsert = "INSERT INTO users(fullname, Email, Telephone, Address, Password) VALUES (?, ?, ?, ?, ?)";
    const sqlDelete = "DELETE FROM userVerification WHERE token = ?";

    db.query(sqlSelect, [Token], (error, result) => {
        if (error) {
            console.log("SQL error", error);
            return res.status(500).json({ error: "An error occurred while executing the SQL query" });
        } else if (result && result.length > 0 && result[0].encdata) {
            console.log("This is the", result[0].encdata);
            const myencryptedObject = result[0].encdata;
            const decryptionKey = 'myEncryptionKey';

            function decryptObject(myencryptedData, key) {
                const decryptedBytes = CryptoJS.AES.decrypt(myencryptedData, key);
                const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
                const decryptedObject = JSON.parse(decryptedString);
                return decryptedObject;
            }

            try {
                const decryptedObject = decryptObject(myencryptedObject, decryptionKey);
                console.log(JSON.parse(decryptedObject));
                const { fullname, email, phone, location, pwd } = JSON.parse(decryptedObject);

                db.query(sqlInsert, [fullname, email, phone, location, pwd], (error, result) => {
                    if (error) {
                        console.log("error from DB", error);
                        return res.status(500).json({ error: "An error occurred while inserting data into the database" });
                    } else {
                        db.query(sqlDelete, [Token], (error, result) => {
                            if (error) {
                                console.log("SQL error", error);
                                return res.status(500).json({ error: "An error occurred while deleting data from the userVerification table" });
                            } else {
                                console.log(result);
                                return res.status(200).json({ message: "User data inserted and token deleted successfully" });
                            }
                        });
                    }
                });
            } catch (error) {
                console.log("Decryption error", error);
                return res.status(500).json({ error: "An error occurred while decrypting the data" });
            }
        } else {
            console.log("endata not present");
            return res.status(404).json({ error: "Sorry this link has expired, kindly make your registration again" });
        }
    });
});


// Agent Register Post
app.post("/api/agentRegister", (req, res) => {
    const { agentFullName, agentEmail, agentPhone, agentWhatsAppPhone, agentState, agentLGA, agentTown, agentLandMark, agentStreetAddress, agentAltAddressPerson1, agentAltAddressPerson2 } = req.body;
    const sqlInsert = "INSERT INTO agentUsers(agentName,agentEmail,agentPhone,agentWhatsAppPhone,agentState,agentLGA,agentTown,agentLandMark,agentStreetAddress,agentAltAddressPerson1,agentAltAddressPerson2) value(?,?,?,?,?,?,?,?,?,?,?)";
    const sqlSelect = "SELECT * FROM agentUsers WHERE agentEmail  = ?"
    db.query(sqlSelect, [agentEmail], (error, result) => {
        if (error) {
            console.log("error From databse");
        } else {
            if (result.length) {
                res.status(200).json({ staus: 200, message: "Agent Already Exist" })
            } else {
                db.query(sqlInsert, [agentFullName, agentEmail, agentPhone, agentWhatsAppPhone, agentState, agentLGA, agentTown, agentLandMark, agentStreetAddress, agentAltAddressPerson1, agentAltAddressPerson2], (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.status(404).json({ status: 404, message: "Agent created Successfully" })
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
        // setInterval(() => {
        //    console.log( req.session.userd);  
        // }, 20000);

        res.send({ loggedIn: true, user: req.session.user, userProperty: req.session.userd })
    } else {
        res.send({ loggedIn: false, })
    }
})

app.post("/api/fetchingProp", (req, res) => {
    const { sessionEmail } = req.body;

    const sqlSelect = `
        SELECT 
            *,
            DATE_FORMAT(Date, '%Y-%m-%d %H:%i:%s') AS formatted_date
        FROM props 
        WHERE Email = ? 
        ORDER BY Date DESC
    `;

    db.query(sqlSelect, [sessionEmail], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "Internal server error" });
        } else {
            // Send the properties with formatted dates in the response
            const formattedResult = result.map(item => {
                return {
                    ...item,
                    Date: item.formatted_date // Replace Date with the actual date column name.
                };
            });

            res.status(200).json({ status: 200, message: "User exists", Properties: formattedResult });
        }
    });
});



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
app.post("/api/logout", (req, res) => {
    const p = req.body.code;
    // console.log(p);
    if (p === 1) {
        req.session.destroy();
    }
})

// Upload Property
app.post("/api/uploadProperty", (req, res) => {
    const { sessionEmail, availableFor, propertyPurpose, propertyType, noOfBedroom, suites, story, landType, landTypeInput, noOfFuelPumps, warehouseInput, hotelBlahBlah, state, LGA, nearestBusStop, streetName, buildingNumber, price, inspection, timeFrom, timeTo, checkboxValues, gardenAllowedRadioBtn } = req.body;
    const petArrays = JSON.stringify(checkboxValues)
    console.log(gardenAllowedRadioBtn);
    // const sqlSelect = "SELECT * FROM props WHERE AvailableFor = ? AND property_purpose = ? AND property_type = ?";

    const sqlInsert = "INSERT INTO props (Email,AvailableFor,property_purpose,property_type,no_of_bedroom,no_of_suites,no_of_story,land_type,no_of_plotAcresHectres,no_of_fuelPumps,no_of_warehouse_in_square_meter,no_of_hotelrooms,state,LGA,nearestBusStop,streetName,buildingNumber,price,PetsArray,GardenAllowed,inspection,timeFrom,timeTo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

    res.status(404).json({ status: 404, message: "Your property has been submmited successfully" })
    db.query(sqlInsert, [sessionEmail, availableFor, propertyPurpose, propertyType, noOfBedroom, suites, story, landType, landTypeInput, noOfFuelPumps, warehouseInput, hotelBlahBlah, state, LGA, nearestBusStop, streetName, buildingNumber, price, petArrays, gardenAllowedRadioBtn, inspection, timeFrom, timeTo], (error, result) => {
        console.log(error);
    })
    // db.query(sqlSelect, [availableFor, propertyPurpose, propertyType, noOfBedroom, suites], (error, result) => {
    //     if (error) {
    //         console.log("Database", error);
    //     } else {
    //         if (result.length > 0) {
    //             console.log("Property Found");
    //             res.status(200).json({ status: 200, message: "Property Already Submited" })
    //         } else {
    //             console.log("Property not Found But submitted");
    //             res.status(404).json({ status: 404, message: "Your property has been submmited successfully" })
    //             db.query(sqlInsert, [sessionEmail, availableFor, propertyPurpose, propertyType, noOfBedroom, suites, story, landType, landTypeInput, noOfFuelPumps, warehouseInput, hotelBlahBlah, state, LGA, nearestBusStop, streetName, buildingNumber, price, petArrays, gardenAllowedRadioBtn, inspection, timeFrom, timeTo], (error, result) => {
    //                 console.log(error);
    //             })
    //         }
    //     }
    // })
})

// Requesting For property

app.post("/api/searchingForProperty", (req, res) => {
    const { availableFor, propertyPurpose, propertyType, noOfBedroom, suites, story, landType, landTypeInput, noOfFuelPumps, warehouseInput, hotelBlahBlah, state, LGA, nearestBusStop, budgetFrom, budgetTo, inspection, formatedTimeFromm, formatedTimeTomm, searchNameContactInfo, searchPhoneCallContactInfo, searchValidEmailContactInfo, searchWahtsappLineContactInfo, searchContactInfoDropdown } = req.body;

    // console.log(req.body);
    const sqlInsert = "INSERT INTO searchedProps (AvailableFor,property_purpose,property_type,no_of_bedroom,no_of_suites,no_of_story,land_type,no_of_plotAcresHectres,no_of_fuelPumps,no_of_warehouse_in_square_meter,no_of_hotelrooms,state,LGA,nearestBusStop,budgetFrom,budgetTo,inspection,timeFrom,timeTo,Name,PhoneCallLine,Email,WhatsappLine,HowShouldWeContactYou) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    res.status(200).json({ status: 200, message: "Submitted successfully, our AI is working on your request we will get back to you soon" })
    db.query(sqlInsert, [availableFor, propertyPurpose, propertyType, noOfBedroom, suites, story, landType, landTypeInput, noOfFuelPumps, warehouseInput, hotelBlahBlah, state, LGA, nearestBusStop, budgetFrom, budgetTo, inspection, formatedTimeFromm, formatedTimeTomm, searchNameContactInfo, searchPhoneCallContactInfo, searchValidEmailContactInfo, searchWahtsappLineContactInfo, searchContactInfoDropdown], (error, result) => {
        console.log("Database", error);
    })
})


app.listen(3002, () => {
    console.log("Server up running on port 3002");
})