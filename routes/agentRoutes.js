// routes/agentRoutes.js
const express = require("express");
const db = require("../config/db");
const router = express.Router();

router.post("/agentRegister", (req, res) => {
  const {
    agentFullName,
    agentEmail,
    agentPhone,
    agentWhatsAppPhone,
    agentState,
    agentLGA,
    agentTown,
    agentLandMark,
    agentStreetAddress,
    agentAltAddressPerson1,
    agentAltAddressPerson2,
  } = req.body;
  const sqlInsert =
    "INSERT INTO agentUsers(agentName,agentEmail,agentPhone,agentWhatsAppPhone,agentState,agentLGA,agentTown,agentLandMark,agentStreetAddress,agentAltAddressPerson1,agentAltAddressPerson2) value(?,?,?,?,?,?,?,?,?,?,?)";
  const sqlSelect = "SELECT * FROM agentUsers WHERE agentEmail  = ?";
  db.query(sqlSelect, [agentEmail], (error, result) => {
    if (error) {
      console.log("error From database");
    } else {
      if (result.length) {
        res.status(200).json({ status: 200, message: "Agent Already Exists" });
      } else {
        db.query(
          sqlInsert,
          [
            agentFullName,
            agentEmail,
            agentPhone,
            agentWhatsAppPhone,
            agentState,
            agentLGA,
            agentTown,
            agentLandMark,
            agentStreetAddress,
            agentAltAddressPerson1,
            agentAltAddressPerson2,
          ],
          (error, result) => {
            if (error) {
              console.log(error);
            } else {
              res
                .status(201)
                .json({ status: 201, message: "Agent created Successfully" });
            }
          }
        );
      }
    }
  });
});

module.exports = router;
