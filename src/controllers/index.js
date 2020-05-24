"use strict";

async function adventureList(request, response, next) {
  response.send("Muestra todas las aventuras disponibles");
}

async function newAdventure(request, response, next) {
  response.send("Crea y guarda una nueva aventura");
}

async function deleteAdventure(request, response, next) {
  response.send("Borra la aventura");
}

module.exports = { adventureList, newAdventure, deleteAdventure };
