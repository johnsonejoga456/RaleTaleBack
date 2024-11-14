const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Requesting For property

router.post("/searchingForProperty", (req, res) => {
  const { propertyData, Location, Budget, Inspection, RequesterInfo } =
    req.body;
  const { PropertyPurpose, needPropertyFor, requestData } = propertyData;
  const { PropertyDetails } = requestData;
  const { localGovernmentArea, state, neighbourhood } = Location;
  const { minPrice, maxPrice } = Budget;
  const { inspectionDate, time } = Inspection;
  const { timeFrom, timeTo } = time;
  const {
    requesterName,
    requesterCallLine,
    requesterEmail,
    requesterWhatsapp,
    preferredFeeback,
  } = RequesterInfo;

  console.log(req.body);

  let noOfBedroom,
    noOfRooms = "No of Rooms",
    noOfFuelPumps = "fuel pumps number",
    suites = "no of suites",
    story = "no of stories",
    landType = "Land type",
    landTypeInput = "land Input",
    wareHouseSize = "warehouse size";

  if (
    PropertyDetails.propertyType == "Duplex" ||
    PropertyDetails.propertyType == "Flat" ||
    PropertyDetails.propertyType == "Bungalow"
  ) {
    noOfBedroom = PropertyDetails.noOfBedroom;
    console.log(noOfBedroom);
  }
  if (PropertyDetails.propertyType == "Shopping Complex") {
    suites == PropertyDetails.suites;
  }
  if (PropertyDetails.propertyType == "Story Building") {
    story == PropertyDetails.story;
  }
  if (PropertyDetails.propertyType == "Land") {
    landType = PropertyDetails.landType;
    landTypeInput = PropertyDetails.landTypeInput;
  }
  if (PropertyDetails.propertyType == "Filling Station") {
    noOfFuelPumps = PropertyDetails.noOfFuelPumps;
  }
  if (PropertyDetails.propertyType == "Warehouse") {
    wareHouseSize = PropertyDetails.warehouseInput;
  }
  if (PropertyDetails.propertyType == "Hotel/Motel/Guest House ") {
    noOfRooms = PropertyDetails.noOfRooms;
  }

  const sqlInsert =
    "INSERT INTO searchedProps (AvailableFor,property_purpose,property_type,no_of_bedroom,no_of_suites,no_of_story,land_type,no_of_plotAcresHectres,no_of_fuelPumps,no_of_warehouse_in_square_meter,no_of_hotelrooms,state,LGA,nearestBusStop,budgetFrom,budgetTo,inspection,timeFrom,timeTo,Name,PhoneCallLine,Email,WhatsappLine,HowShouldWeContactYou) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  res.status(200).json({
    status: 200,
    message:
      "Submitted successfully, our AI is working on your request we will get back to you soon",
  });
  db.query(
    sqlInsert,
    [
      needPropertyFor,
      PropertyPurpose,
      PropertyDetails.propertyType,
      noOfBedroom,
      suites,
      story,
      landType,
      landTypeInput,
      noOfFuelPumps,
      wareHouseSize,
      noOfRooms,
      state,
      localGovernmentArea,
      neighbourhood,
      minPrice,
      maxPrice,
      inspectionDate,
      timeFrom,
      timeTo,
      requesterName,
      requesterCallLine,
      requesterEmail,
      requesterWhatsapp,
      preferredFeeback,
    ],
    (error, result) => {
      if (error) {
        console.log("Database", error);
      }
      console.log("thia", result);
    }
  );
});


// Upload Property
router.post("/uploadProperty", (req, res) => {
  const {
    email,
    availableFor,
    propertyPurpose,
    propertyType,
    noOfBedroom,
    suites,
    story,
    landType,
    landTypeInput,
    noOfFuelPumps,
    warehouseInput,
    hotelBlahBlah,
    state,
    LGA,
    nearestBusStop,
    streetName,
    buildingNumber,
    price,
    inspection,
    timeFrom,
    timeTo,
    checkboxValues,
    gardenAllowedRadioBtn,
  } = req.body;
  const petArrays = JSON.stringify(checkboxValues);
  console.log(gardenAllowedRadioBtn);
  // const sqlSelect = "SELECT * FROM props WHERE AvailableFor = ? AND property_purpose = ? AND property_type = ?";

  const sqlInsert =
    "INSERT INTO props (Email,AvailableFor,property_purpose,property_type,no_of_bedroom,no_of_suites,no_of_story,land_type,no_of_plotAcresHectres,no_of_fuelPumps,no_of_warehouse_in_square_meter,no_of_hotelrooms,state,LGA,nearestBusStop,streetName,buildingNumber,price,PetsArray,GardenAllowed,inspection,timeFrom,timeTo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

  res.status(200).json({
    status: 200,
    message: "Your property has been submmited successfully",
  });

  db.query(
    sqlInsert,
    [
      email,
      availableFor,
      propertyPurpose,
      propertyType,
      noOfBedroom,
      suites,
      story,
      landType,
      landTypeInput,
      noOfFuelPumps,
      warehouseInput,
      hotelBlahBlah,
      state,
      LGA,
      nearestBusStop,
      streetName,
      buildingNumber,
      price,
      petArrays,
      gardenAllowedRadioBtn,
      inspection,
      timeFrom,
      timeTo,
    ],
    (error, result) => {
      console.log(error);
    }
  );
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
});

module.exports = router;