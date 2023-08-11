const os = require("os");
const logger = require("./helpers/logger");
const database = require("./helpers/config");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8000;
const ENV_NAME = process.env.ENV_NAME || "development";
const SERVICE_NAME = process.env.SERVICE_NAME || "NODEJS_EXPRESS";

database.connectToMongoDB();

app.get("/ping", (req, res) => {
  res.set("Content-Type", "application/json");
  logger.info('client ' + req.socket.remoteAddress + ' pingged');
  res.send(JSON.stringify("PONG", null, 4));
});

app.get("/", (req, res) => {
  var data = {
    sevice_name: SERVICE_NAME,
    port: PORT,
    description: "Simple nodejs app running with Express.",
    environment: ENV_NAME,
    instance: os.hostname(),
  };
  res.set("Content-Type", "application/json");
  res.send(JSON.stringify(data, null, 4));
});

app.listen(PORT, () => {
  logger.info(SERVICE_NAME + " running on port " + PORT);
});
