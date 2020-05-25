"use strict";

const express = require("express");
// controllers
const {
  adventureList,
  newAdventure,
  deleteAdventure,
} = require("../controllers/adventureController");

//////////////// APP //////////////////////
const app = express();

app.get("/adventures", adventureList);
app.post("/adventures", newAdventure);
app.delete("/adventures/:id", deleteAdventure);

module.exports = app;
