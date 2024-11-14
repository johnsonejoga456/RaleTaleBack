const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Login Post
router.post("/loginPost", (req, res) => {
  const { email, password } = req.body;
  const sqlSelect = "SELECT * FROM users WHERE Email = ? AND Password = ?";
  db.query(sqlSelect, [email, password], (error, result) => {
    if (error) {
      console.log("error from database", error);
    } else {
      if (result.length > 0) {
        req.session.user = result;
        const fullUserName = result[0].fullname;
        const sqlSelect = "SELECT * FROM props WHERE Email = ?";
        db.query(sqlSelect, [email], (error, result) => {
          // console.log(result);
          req.session.userd = result;
          res.status(200).json({
            status: 200,
            message: "User exist",
            fullName: fullUserName,
            email,
            Email: result,
          });
        });
      } else {
        res
          .status(404)
          .json({ status: 404, message: "Wrong Email or Password" });
      }
    }
  });
});

// Logout the user
router.post("/logout", (req, res) => {
  const p = req.body.code;
  // console.log(p);
  if (p === 1) {
    req.session.destroy();
  }
});

// Session storing get
router.get("/loginPost", (req, res) => {
  if (req.session.user) {
    // setInterval(() => {
    //    console.log( req.session.userd);
    // }, 20000);

    res.send({
      loggedIn: true,
      user: req.session.user,
      userProperty: req.session.userd,
    });
  } else {
    res.send({ loggedIn: false });
  }
});

// Register User
router.post("/registerPost", (req, res) => {
  const { fullname, email, phone, location, pwd } = req.body;
  const sqlSelect = "SELECT * FROM users WHERE Email  = ?";
  db.query(sqlSelect, [email], (error, result) => {
    if (result.length) {
      res.status(409).json({ message: "Email already exists" });
    } else {
      res.status(200).json({ message: "Success", data: req.body });
    }
  });
});

// Verfiy A User
router.post("/verifyUserPost", (req, res) => {
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
            });
          }, 60000 * 30);

          console.log(result);

          res.status(200).json({ status: 200, message: result });
        }
      });
    }
  });
});

// For Verified User
router.post("/verifiedUserPost", (req, res) => {
  const { Token } = req.body;
  console.log("This is the", Token);
  const sqlSelect = "SELECT * FROM userVerification WHERE token = ?";
  const sqlInsert =
    "INSERT INTO users(fullname, Email, Telephone, Address, Password) VALUES (?, ?, ?, ?, ?)";
  const sqlDelete = "DELETE FROM userVerification WHERE token = ?";

  db.query(sqlSelect, [Token], (error, result) => {
    if (error) {
      console.log("SQL error", error);
      return res
        .status(500)
        .json({ error: "An error occurred while executing the SQL query" });
    } else if (result && result.length > 0 && result[0].encdata) {
      console.log("This is the", result[0].encdata);
      const myencryptedObject = result[0].encdata;
      const decryptionKey = "myEncryptionKey";

      function decryptObject(myencryptedData, key) {
        const decryptedBytes = CryptoJS.AES.decrypt(myencryptedData, key);
        const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
        const decryptedObject = JSON.parse(decryptedString);
        return decryptedObject;
      }

      try {
        const decryptedObject = decryptObject(myencryptedObject, decryptionKey);
        console.log(JSON.parse(decryptedObject));
        const { fullname, email, phone, location, pwd } =
          JSON.parse(decryptedObject);

        db.query(
          sqlInsert,
          [fullname, email, phone, location, pwd],
          (error, result) => {
            if (error) {
              console.log("error from DB", error);
              return res.status(500).json({
                error:
                  "An error occurred while inserting data into the database",
              });
            } else {
              db.query(sqlDelete, [Token], (error, result) => {
                if (error) {
                  console.log("SQL error", error);
                  return res.status(500).json({
                    error:
                      "An error occurred while deleting data from the userVerification table",
                  });
                } else {
                  console.log(result);
                  return res.status(200).json({
                    message:
                      "User data inserted and token deleted successfully",
                  });
                }
              });
            }
          }
        );
      } catch (error) {
        console.log("Decryption error", error);
        return res
          .status(500)
          .json({ error: "An error occurred while decrypting the data" });
      }
    } else {
      console.log("endata not present");
      return res.status(404).json({
        error:
          "Sorry this link has expired, kindly make your registration again",
      });
    }
  });
});

// get All Users From DB
router.get("/getUsers", (req, res) => {
  const sqlSelect = "SELECT * FROM users";
  db.query(sqlSelect, (error, result) => {
    res.send(result);
  });
    console.log("hello");
    
});

// Deleting a User From the DB
router.post("/DropUsers", (req, res) => {
  const { email } = req.body;
  const sqlDrop = "DELETE FROM users WHERE Email = ?";
  db.query(sqlDrop, [email], (error, result) => {
    if (error) console.log(error);
    res.send({ status: "Deleted", result });
  });
});

// Add other user-related routes here

module.exports = router;
