"use strict";

// Requerimos controllers
const {
  adventureList,
  newAdventure,
  deleteAdventure,
} = require("./controllers");

//////////////// ROUTES ////////////////////

const getAdventureList = app.get("/", adventureList);
const postNewAdventure = app.post("/", newAdventure);
const reqDeleteAdventure = app.delete("/", deleteAdventure);

module.exports = { getAdventureList, postNewAdventure, reqDeleteAdventure };
